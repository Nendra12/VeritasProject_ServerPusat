const Redis = require('ioredis');

// Redis Subscriber untuk ServerPusat
const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redisSubscriber.on('connect', () => {
  console.log('✅ Redis Subscriber connected');
});

redisSubscriber.on('error', (err) => {
  console.error('❌ Redis Subscriber Error:', err.message);
});

module.exports = redisSubscriber;
