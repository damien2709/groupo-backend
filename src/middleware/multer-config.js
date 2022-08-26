// ROLE : Ce middleware va configurer Multer pour qu'il sache comment gérer les fichiers envoyés par les utilisateurs. 

const multer = require('multer');

//On crée un dictionnaire mime_types (qui sera un objet) et qui va définir les différents mime-types qu'on peut recevoir du frontend
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//on crée un objet de configuration pour Multer. On utilise la méthode "diskstorage" de Multer pour enregistrer l'objet sur le disque. Cet objet de configuration a besoin de 2 propriétés : en 1er la destination (ce sera une fonction qui explique à Multer où enregistrer les fichiers et qui prend 3 arguments, on ne se servira ici que du 3ème argument). Puis en 2ème  le filename qui explique à multer quel nom de fichier utiliser (c'est encore une fonction qui prend 3 arguments)

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); //le 1er argument est "null" pour dire qu'il n'y a pas d'erreur à ce niveau là, le 2ème argument est la destination
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // ici on génère le nom du nouveau fichier. On récupère le nom du fichier original puis on lui soustrait s'il y en a les espaces qu'on remplace par des "_". Ca élimine le pb des espaces dans une BDD.
    const extension = MIME_TYPES[file.mimetype]; //On va utiliser des mime_types pour générer une extension pour le fichier. On prend l'élément de notre dictionnaire qui correspond au mime_type du fichier qui a été envoyé par le frontend.
    const namePicture = name + Date.now() + '.' + extension; // on a le fichier et son extension, on appelle maintenant la fonction callback. le 1er argument est "null" pour dire qu'il n'y a pas d'erreur à ce niveau là, le 2ème argument sera le filename que l'on va créé en entier : on reprend le name créé ci-dessus, auquel on ajoute un timestamp pour le rendre unique (Date.now()), puis un point et l'extension que l'on a créée.
    callback(null, namePicture);
  }
});


// J'exporte le module/objet multer avec des propriétés de configuration :
module.exports = multer({
    storage: storage,
    limits: { filesize: 5000000}, // la limite de taille du fichier, ici 5MB
  // Une fonction pour filtrer et tester les types de fichiers fournis : A faire

}).single('picture'); //ensuite je précise si c'est un upload d'un fichier (.single) ou de plusieurs fichiers. Ici on appelle la méthode "single" pour dire qu'il s'agit d'un fichier unique et pas d'un groupe, à laquelle on passe l'argument "picture" qui est la valeur du "name" de l'input du formulaire front multiformat (input contenant le fichier).