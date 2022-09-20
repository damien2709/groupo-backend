// ROLE : Ce middleware va configurer Multer pour qu'il sache comment gérer les fichiers envoyés par les utilisateurs. 

const multer = require('multer');

//dictionnaire mime_types 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//objet de configuration pour Multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); 
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); 
    const extension = MIME_TYPES[file.mimetype]; 
    const namePicture = name + Date.now() + '.' + extension; 
    callback(null, namePicture);
  }
});


module.exports = multer({
    storage: storage,
    limits: { filesize: 5000000}, 
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Seul les fichiers au format .png, .jpg ou .jpeg sont acceptés'));
      }
    }
}).single('picture'); 