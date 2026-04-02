import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

class NotificationService {
  /**
   * Register the device for push notifications and return the token.
   */
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'web') return;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return;
      }
      
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn('No EAS Project ID found in app.json');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
      console.warn('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  /**
   * Save the push token for the current user in Supabase.
   */
  async savePushToken(userId: string, token: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', userId);

      if (error) throw error;
      console.log('[NotificationService] Push token saved for user:', userId);
    } catch (error) {
      console.error('[NotificationService] Error saving push token:', error);
    }
  }

  /**
   * Send a notification to a specific user.
   */
  async sendStatusUpdate(userId: string, status: 'approved' | 'rejected', reportTitle: string) {
    const title = `Report ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    const body = `Your report "${reportTitle}" has been ${status}.`;

    try {
      // 1. Fetch user's push token from profiles
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', userId)
        .single();

      if (fetchError || !profile?.push_token) {
        console.warn('[NotificationService] No push token found for user:', userId);
        return { success: false, error: 'No token' };
      }

      // 2. Send via Expo Push API (normally should be done in a secure backend/service)
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          to: profile.push_token,
          title,
          body,
          data: { status, reportTitle },
        }),
      });

      const result = await response.json();
      console.log('[NotificationService] Push result:', result);

      return { success: true };
    } catch (error) {
      console.error('[NotificationService] Failed to send notification:', error);
      return { success: false, error };
    }
  }

  /**
   * Notify admins about a new report submission.
   */
  async notifyAdmins(reportTitle: string, reporterName: string) {
    // Collect admin tokens and send notification
    console.log(`[NotificationService] Admin notify (simulated): New report ${reportTitle}`);
  }
}

export const notificationService = new NotificationService();
