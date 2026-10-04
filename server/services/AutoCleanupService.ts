import { IRoomStore } from '../stores/RoomStore';

export class AutoCleanupService {
  private timer: NodeJS.Timeout | null = null;

  start(roomStore: IRoomStore) {
    const autoDeleteEnabled = process.env.AUTO_DELETE_ENABLED !== 'false';
    const expirationMinutes = parseInt(process.env.ROOM_EXPIRATION_MINUTES || '120', 10);

    if (!autoDeleteEnabled) {
      console.log('ℹ️ Auto-delete room cleanup is disabled.');
      return;
    }

    console.log(`🧹 Auto cleanup service active (Expiration: ${expirationMinutes} minutes).`);

    // Run check every 1 minute
    this.timer = setInterval(() => {
      const removedIds = roomStore.cleanExpiredRooms(expirationMinutes);
      if (removedIds.length > 0) {
        console.log(`🧹 Auto-cleaned ${removedIds.length} expired room(s): ${removedIds.join(', ')}`);
      }
    }, 60 * 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const autoCleanupService = new AutoCleanupService();
