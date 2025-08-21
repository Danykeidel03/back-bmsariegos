const API_KEY = 'bm-sariegos-internal-2024';

const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({
            status: 401,
            message: 'API Key requerida o inválida'
        });
    }
    
    next();
};

module.exports = { verifyApiKey };