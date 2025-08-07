const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'di6pl9jzi',
    api_key: '694118119716869',
    api_secret: 'AvXp8hCdBzPEd8zCZu4E4rY8tkM'
});

module.exports = cloudinary;