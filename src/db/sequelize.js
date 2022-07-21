// **** ROLE : INITIALISATION, CONNEXION ET COMMUNICATION AVEC LA BDD

// ------------------ IMPORTATIONS -----------------
const { Sequelize, DataTypes } = require('sequelize') //syntaxe ES6 d'importation d'une méthode d'un fichier plutôt que du fichier complet. On importe l'ORM Sequelize pour communiquer avec la BDD sur MAMP. On importe également l'objet 'DataTypes' qui contient les types disponibles dans Sequelize pour définir les types de données contenus dans les propriétés du modèle. 
const PostModel = require('../models/postModel') //on importe notre modèle (de table) Sequelize "Post" déclaré dans le fichier 'postModel.js'
const UserModel = require('../models/userModel') //on importe notre modèle (de table) Sequelize "User" déclaré dans le fichier 'UserModel.js'


// ---------------- CONNEXION A LA BDD ----------------

const sequelize = new Sequelize(
	'groupomania', // C'est le nom de la BDD que l'on veut créer
	'root', // C'est l'identifiant permettant d'accéder à la BDD, par défaut l'id est "root"
	'root', // C'est le mot de passe de la BDD pour l'utilisateur, par défaut par MAMP à la création. Attention si c'était XAMP avec Mariadb, le mdp par défaut serait une chaine de caractères vide ''. 
	// On passe ensuite un objet de configuration : 
	{
	  host: 'localhost', // Permet d'indiquer ou se trouve la BDD sur votre machine
	  port: '8889', //on met le port de MySql de Mamp qui est par défaut de 8889 !
	  dialect: 'mysql', // Le nom du driver que nous utilisons pour permettre à Sequelize d'interagir avec la BDD.
	// Si c'est une BDD "MariaDb", on utilisera le driver : dialect: 'mariadb'
	  })

    // On teste la connexion à la BDD avec la méthode authenticate de Sequelize
sequelize.authenticate()
	.then(_ => console.log('La connexion à la BDD a bien été établie'))
	.catch(error => console.log('Impossible de se connecter à la BDD ${error}'))


// ----------------- CREATION/ GESTION DES TABLES ET SYNCHRONISATION -----------
 // On crée une table dans la BDD, associé à un modèle Sequelize
const Post = PostModel(sequelize, DataTypes) // On passe en paramètres les 2 qui sont attendus par notre modèle 
const User = UserModel(sequelize, DataTypes) // On instancie auprès de Sequelize notre modèle User
// On synchronise la BDD en créant la fonction 'initDb' et en lui passant des modèles

// ------------------ EXPORTATION ----------------
    // j'exporte la fonction initDb, les modèles "Post" et "user". On pourra réutiliser ces éléments ailleurs dans notre code. 
module.exports = { 
  Post,
  User
}
