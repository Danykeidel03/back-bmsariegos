require('dotenv').config();

const API_KEY = process.env.API_KEY || 'default-api-key';

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