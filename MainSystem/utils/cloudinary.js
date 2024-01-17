const multer = require('multer');

cloudinary.config({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadCloud = multer({ storage });

module.exports = 