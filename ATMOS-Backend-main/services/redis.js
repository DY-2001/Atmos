// const redis = require('redis');
// const mongoose = require('mongoose')
// const exec = mongoose.Query.prototype.exec;
// const client = redis.createClient({
//     password: 'RZeCWM8cW5R6sDX490RZygAXf3nfdaLa',
//     socket: {
//         host: 'redis-18403.c282.east-us-mz.azure.cloud.redislabs.com',
//         port: 18403
//     }
// });

// (async () => {
//     client.on("error", (error) => console.error(`Error : ${error}`));
//     client.on("connect", () => console.log(`Connected to redis`));
//     await client.connect();
// })();

// mongoose.Query.prototype.cache = function (options = {}) {
//     this.useCache = true;
//     this.hashKey = JSON.stringify(options.key || 'default')
//     return this;
// }

// mongoose.Query.prototype.exec = async function () {
//     if (!this.useCache) {
//         return exec.apply(this, arguments)
//     }

//     const key = JSON.stringify(Object.assign({}, this.getQuery(), {
//         collection: this.mongooseCollection.name
//     }))
//     const cachedVal = await client.HGET(this.hashKey, key)
//     if (cachedVal) {
//         const user = JSON.parse(cachedVal)
//         console.log("From redis", user)
//         return Array.isArray(user)
//         ? user.map(u => new this.model(u))
//         : new this.model(user);
//     }
//     const result = await exec.apply(this, arguments)
//     await client.HSET(this.hashKey, key, JSON.stringify(result))
//     return result
// }

// module.exports = {
//     async clearHash(hashKey) {
//         client.del(JSON.stringify(hashKey));
//         client.flushAll()
//     }
// };

