const redisClient = require('../config/redis');

async function clearEmployeeCache() {
  const keys = await redisClient.keys("employees:list:*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

async function getEmployeeCache(cacheKey) {
  const redisKey = `employees:list:${cacheKey}`;
  const cachedData = await redisClient.get(redisKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
}

async function setEmployeeCache(cacheKey, data, ttl = 60) {
  const redisKey = `employees:list:${cacheKey}`;
  await redisClient.set(redisKey, JSON.stringify(data), { EX: ttl });
}

module.exports = {
  clearEmployeeCache,
  getEmployeeCache,
  setEmployeeCache,
};
