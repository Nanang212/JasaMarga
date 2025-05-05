const redisClient = require('../config/redis');

// Fungsi untuk membersihkan cache dengan prefix yang lebih general
async function clearCache(namespace, cacheKey) {
  const keys = await redisClient.keys(`${namespace}:${cacheKey}:*`);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

// Fungsi untuk mendapatkan data dari cache
async function getCache(namespace, cacheKey) {
  const redisKey = `${namespace}:${cacheKey}`;
  const cachedData = await redisClient.get(redisKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
}

// Fungsi untuk menyimpan data ke cache dengan TTL (Time-to-Live)
async function setCache(namespace, cacheKey, data, ttl = 120) {
  const redisKey = `${namespace}:${cacheKey}`;
  await redisClient.set(redisKey, JSON.stringify(data), { EX: ttl });
}

module.exports = {
  clearCache,
  getCache,
  setCache,
};
