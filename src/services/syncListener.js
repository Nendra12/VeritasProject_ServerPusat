const redisSubscriber = require('../config/redis');
const SyncHandler = require('./syncHandler');

const CHANNELS = {
  PUTUSAN_CREATED: 'putusan:created',
  PUTUSAN_UPDATED: 'putusan:updated',
  PUTUSAN_DELETED: 'putusan:deleted',
};

class SyncListener {
  static start() {
    console.log('🚀 Starting Redis Sync Listener...');

    // Subscribe to all channels
    redisSubscriber.subscribe(
      CHANNELS.PUTUSAN_CREATED,
      CHANNELS.PUTUSAN_UPDATED,
      CHANNELS.PUTUSAN_DELETED,
      (err, count) => {
        if (err) {
          console.error('❌ Failed to subscribe:', err.message);
          return;
        }
        console.log(`✅ Subscribed to ${count} channels`);
      }
    );

    // Handle incoming messages
    redisSubscriber.on('message', async (channel, message) => {
      try {
        const payload = JSON.parse(message);
        console.log(`📨 [${channel}] Received message from ${payload.lembaga_id}`);

        switch (channel) {
          case CHANNELS.PUTUSAN_CREATED:
            await SyncHandler.handlePutusanCreated(payload);
            break;

          case CHANNELS.PUTUSAN_UPDATED:
            await SyncHandler.handlePutusanUpdated(payload);
            break;

          case CHANNELS.PUTUSAN_DELETED:
            await SyncHandler.handlePutusanDeleted(payload);
            break;

          default:
            console.warn(`⚠️  Unknown channel: ${channel}`);
        }
      } catch (err) {
        console.error('❌ [LISTENER ERROR]', err.message);
      }
    });

    console.log('✅ Sync Listener is running');
  }

  static stop() {
    redisSubscriber.unsubscribe();
    redisSubscriber.disconnect();
    console.log('🛑 Sync Listener stopped');
  }
}

module.exports = SyncListener;
