import { supabase } from './supabase';
import { Message, UserRole } from '../types';
import { logger } from './logger';
import { RealtimeChannel } from '@supabase/supabase-js';

interface MessageData {
  id: string;
  user_id: string;
  zone: string;
  message: string;
  timestamp: string;
  profiles?: Array<{ full_name?: string; role?: UserRole }> | null;
}

export class ChatService {
  private static instance: ChatService;
  private realtimeSubscription: RealtimeChannel | null = null;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async getMessagesForZone(zone: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          user_id,
          zone,
          message,
          timestamp,
          profiles:user_id (
            full_name,
            role
          )
        `)
        .eq('zone', zone)
        .order('timestamp', { ascending: true });

      if (error) {
        logger.error('Error fetching messages:', error);
        throw new Error('Failed to fetch messages');
      }

      return data.map((msg: MessageData) => ({
        id: msg.id,
        user_id: msg.user_id,
        zone: msg.zone,
        message: msg.message,
        timestamp: msg.timestamp,
        sender_name: msg.profiles?.[0]?.full_name || 'Unknown User',
        sender_role: msg.profiles?.[0]?.role || 'staff',
      }));
    } catch (error) {
      logger.error('Error in getMessagesForZone:', error);
      throw error;
    }
  }

  async sendMessage(zone: string, message: string, userId: string): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: userId,
          zone,
          message,
          timestamp: new Date().toISOString(),
        })
        .select(`
          id,
          user_id,
          zone,
          message,
          timestamp,
          profiles:user_id (
            full_name,
            role
          )
        `)
        .single();

      if (error) {
        logger.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }

      return {
        id: data.id,
        user_id: data.user_id,
        zone: data.zone,
        message: data.message,
        timestamp: data.timestamp,
        sender_name: data.profiles?.[0]?.full_name || 'Unknown User',
        sender_role: data.profiles?.[0]?.role || 'staff',
      };
    } catch (error) {
      logger.error('Error in sendMessage:', error);
      throw error;
    }
  }

  subscribeToZoneMessages(zone: string, callback: (message: Message) => void): () => void {
    let isMounted = true;

    try {
      const channel = supabase
        .channel(`zone_messages_${zone}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `zone=eq.${zone}`,
          },
          async (payload) => {
            if (!isMounted) return; // Prevent callback after unmount

            try {
              // Fetch the complete message with profile data
              const { data, error } = await supabase
                .from('messages')
                .select(`
                  id,
                  user_id,
                  zone,
                  message,
                  timestamp,
                  profiles:user_id (
                    full_name,
                    role
                  )
                `)
                .eq('id', payload.new.id)
                .single();

              if (error || !isMounted) {
                if (error) logger.error('Error fetching new message:', error);
                return;
              }

              const message: Message = {
                id: data.id,
                user_id: data.user_id,
                zone: data.zone,
                message: data.message,
                timestamp: data.timestamp,
                sender_name: data.profiles?.[0]?.full_name || 'Unknown User',
                sender_role: data.profiles?.[0]?.role || 'staff',
              };

              callback(message);
            } catch (error) {
              logger.error('Error processing realtime message:', error);
            }
          }
        )
        .subscribe();

      this.realtimeSubscription = channel;

      return () => {
        isMounted = false;
        if (this.realtimeSubscription) {
          supabase.removeChannel(this.realtimeSubscription);
          this.realtimeSubscription = null;
        }
      };
    } catch (error) {
      logger.error('Error subscribing to messages:', error);
      return () => {
        isMounted = false;
      };
    }
  }

  async validateMessage(message: string): Promise<{ isValid: boolean; error?: string }> {
    if (!message || message.trim().length === 0) {
      return { isValid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 1000) {
      return { isValid: false, error: 'Message too long (max 1000 characters)' };
    }

    // Check for potentially harmful content (basic validation)
    const harmfulPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(message)) {
        return { isValid: false, error: 'Message contains invalid content' };
      }
    }

    return { isValid: true };
  }

  async getMessageCount(zone: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('zone', zone);

      if (error) {
        logger.error('Error getting message count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      logger.error('Error in getMessageCount:', error);
      return 0;
    }
  }
}