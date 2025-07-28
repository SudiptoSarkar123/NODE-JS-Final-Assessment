const multer = require('multer');
const path = require('path');
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (file.fieldname === 'profilePic') {
            uploadPath = path.join(__dirname, '../../uploads/profilePic');
        } else {
            uploadPath = path.join(__dirname, '../../uploads/others');
        }
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSufix + path.extname(file.originalname));
    }
});

const fileFilter = (req,file, cb)=>{
    const allowedTypes  = /jpeg|jpg|png/;

    const isValid = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    if(isValid){
        cb(null, true)
    } else{
        cb(new Error('Only jpeg, jpg, png files are allowed'));
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits:{ fileSize: 15 * 1024 * 1024 }
})


module.exports = upload;