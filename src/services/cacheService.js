// Cache simple en memoria para las clasificaciones
let cache = new Map();
const TTL = 30 * 60 * 1000; // 30 minutos

const cacheService = {
    get(key) {
        const item = cache.get(key);
        if (item && (Date.now() - item.timestamp) < TTL) {
            return item.data;
        }
        cache.delete(key);
        return null;
    },

    set(key, data) {
        cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    },

    clear(key) {
        if (key) {
            cache.delete(key);
        } else {
            cache.clear();
        }
    }
};

module.exports = cacheService;