import { ChatService } from '../chatService';
import { supabase } from '../supabase';

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null,
          })),
        })),
      })),
      channel: jest.fn(() => ({
        on: jest.fn(() => ({
          subscribe: jest.fn(() => ({
            unsubscribe: jest.fn(),
          })),
        })),
      })),
      removeChannel: jest.fn(),
    })),
  },
}));

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    chatService = ChatService.getInstance();
    jest.clearAllMocks();
  });

  describe('getMessagesForZone', () => {
    it('should fetch messages for a zone successfully', async () => {
      const mockData = [
        {
          id: '1',
          user_id: 'user1',
          zone: 'Lagos',
          message: 'Test message',
          timestamp: '2025-11-02T10:00:00',
          profiles: [{ full_name: 'John Doe', role: 'staff' }],
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockData, error: null })),
          })),
        })),
      });

      const result = await chatService.getMessagesForZone('Lagos');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '1',
        user_id: 'user1',
        zone: 'Lagos',
        message: 'Test message',
        timestamp: '2025-11-02T10:00:00',
        sender_name: 'John Doe',
        sender_role: 'staff',
      });
    });

    it('should handle errors when fetching messages', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: null, error: new Error('Database error') })),
          })),
        })),
      });

      await expect(chatService.getMessagesForZone('Lagos')).rejects.toThrow('Failed to fetch messages');
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const mockData = {
        id: '1',
        user_id: 'user1',
        zone: 'Lagos',
        message: 'Test message',
        timestamp: '2025-11-02T10:00:00',
        profiles: [{ full_name: 'John Doe', role: 'staff' }],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: mockData, error: null })),
          })),
        })),
      });

      const result = await chatService.sendMessage('Lagos', 'Test message', 'user1');

      expect(result).toEqual({
        id: '1',
        user_id: 'user1',
        zone: 'Lagos',
        message: 'Test message',
        timestamp: '2025-11-02T10:00:00',
        sender_name: 'John Doe',
        sender_role: 'staff',
      });
    });

    it('should handle errors when sending messages', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: new Error('Insert error') })),
          })),
        })),
      });

      await expect(chatService.sendMessage('Lagos', 'Test message', 'user1')).rejects.toThrow('Failed to send message');
    });
  });

  describe('validateMessage', () => {
    it('should validate a valid message', async () => {
      const result = await chatService.validateMessage('Valid message');
      expect(result).toEqual({ isValid: true });
    });

    it('should reject empty messages', async () => {
      const result = await chatService.validateMessage('');
      expect(result).toEqual({ isValid: false, error: 'Message cannot be empty' });
    });

    it('should reject messages that are too long', async () => {
      const longMessage = 'a'.repeat(1001);
      const result = await chatService.validateMessage(longMessage);
      expect(result).toEqual({ isValid: false, error: 'Message too long (max 1000 characters)' });
    });

    it('should reject messages with harmful content', async () => {
      const result = await chatService.validateMessage('<script>alert("xss")</script>');
      expect(result).toEqual({ isValid: false, error: 'Message contains invalid content' });
    });
  });

  describe('subscribeToZoneMessages', () => {
    it('should subscribe to real-time messages', () => {
      const mockCallback = jest.fn();
      const mockChannel = {
        on: jest.fn(() => ({
          subscribe: jest.fn(() => 'subscription'),
        })),
      };

      (supabase.channel as jest.Mock).mockReturnValue(mockChannel);

      const unsubscribe = chatService.subscribeToZoneMessages('Lagos', mockCallback);

      expect(supabase.channel).toHaveBeenCalledWith('zone_messages_Lagos');
      expect(mockChannel.on).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe('function');
    });

    it('should handle subscription errors gracefully', () => {
      const mockCallback = jest.fn();
      (supabase.channel as jest.Mock).mockImplementation(() => {
        throw new Error('Subscription error');
      });

      const unsubscribe = chatService.subscribeToZoneMessages('Lagos', mockCallback);

      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('getMessageCount', () => {
    it('should get message count for a zone', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            head: jest.fn(() => Promise.resolve({ count: 5, error: null })),
          })),
        })),
      });

      const result = await chatService.getMessageCount('Lagos');
      expect(result).toBe(5);
    });

    it('should return 0 on error', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            head: jest.fn(() => Promise.resolve({ count: null, error: new Error('Count error') })),
          })),
        })),
      });

      const result = await chatService.getMessageCount('Lagos');
      expect(result).toBe(0);
    });
  });
});