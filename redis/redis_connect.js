var redis = require('redis');

module.exports = redis.createClient({host:process.env.redishost, port:process.env.redisport,password:process.env.redispass});
