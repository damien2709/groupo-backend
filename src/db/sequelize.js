// **** ROLE : INITIALISATION, CONNEXION ET COMMUNICATION AVEC LA BDD

// ------------------ IMPORTATIONS -----------------
const { Sequelize, DataTypes } = require('sequelize') //syntaxe ES6 d'importation d'une méthode d'un fichier plutôt que du fichier complet. On importe l'ORM Sequelize pour communiquer avec la BDD sur MAMP. On importe également l'objet 'DataTypes' qui contient les types disponibles dans Sequelize pour définir les types de données contenus dans les propriétés du modèle. 
const PostModel = require('../models/postModel.js') //on importe notre modèle (de table) Sequelize "Post" déclaré dans le fichier 'postModel.js'
const CommentModel = require('../models/commentModel.js') //on importe notre modèle (de table) Sequelize "Post" déclaré dans le fichier 'postModel.js'
const UserModel = require('../models/userModel.js') //on importe notre modèle (de table) Sequelize "User" déclaré dans le fichier 'UserModel.js'
const postBdd = require('./mock-posts.js')
const commentBdd = require('./mock-comment.js')
const bcrypt = require('bcrypt') //j'importe le module bcrypt pour hasher les mots de passe. 

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


// ----------------- CREATION/ GESTION DES TABLES -----------
 // On crée une table dans la BDD, associé à un modèle Sequelize
const Post = PostModel(sequelize, DataTypes) // On passe en paramètres les 2 qui sont attendus par notre modèle
const Comment = CommentModel(sequelize, DataTypes) // On passe en paramètres les 2 qui sont attendus par notre modèle 
const User = UserModel(sequelize, DataTypes) // On instancie auprès de Sequelize notre modèle User

// ----------------- SYNCHRONISATION de la BDD avec intégration nouveaux posts, comments et user-----------

// On synchronise la BDD en créant la fonction 'initDb' et en lui passant des modèles
const initDb = () => {
	return sequelize.sync({force: true}) //force:true permet de supprimer la table associée au modèle avant chaque synchronisation. On perd les données précédentes mais ça nous facilite la vie dans la phase de développement. Par exemple, pour apporter des modifications de modèles sans se trimballer les anciennes propriétés qui ont disparus du modèle. 
	
	// je crée des nouvelles instances de post avec la méthode create de mon modèle. Je ne passe ni son ID ni sa date de création, c'est la BDD qui s'en occupe ! Grace à la méthode .map(), je peux boucler sur la liste statique des différents posts qui est déclarée dans mock-posts.js et importée.  Ca me permet de pousser directement, lors du démarrage de notre API REST, 3 posts en Base de données. 
	  .then(_ => {
		  postBdd.map(post => {
		  Post.create({
			  authorId: post.authorId,
			  title: post.title,
			  content: post.content,
			  category: post.category,
			  picture: post.picture,
			  like: post.like
		  }).then(post => console.log(post.toJSON())) // on demande à Sequelize de faire une requête à la BDD pour demander si chaque post a bien été créé, et on attend sa réponse en asynchrone. Elle arrive en JSON (pour afficher correctement les informations d'une instance d'un modèle) car la méthode 'toJSON' permet de n'afficher en JSOn que les valeurs qui nous interessent (et pas celles en interne de Sequelize). 
		  })
		  commentBdd.map(comment => {
			Comment.create({
				authorId: comment.authorId,
				postId: comment.postId,
				content: comment.content,
				picture: comment.picture,
				like: comment.like
			}).then(comment => console.log(comment.toJSON())) // on demande à Sequelize de faire une requête à la BDD pour demander si chaque post a bien été créé, et on attend sa réponse en asynchrone. Elle arrive en JSON (pour afficher correctement les informations d'une instance d'un modèle) car la méthode 'toJSON' permet de n'afficher en JSOn que les valeurs qui nous interessent (et pas celles en interne de Sequelize). 
			})
		  // on pousse un nouvel utilisateur en bdd grace à la méthode 'create', avec un mot de passe hashé grace à bcrypt: 
		  bcrypt.hash('Groupo2709@', 10)
			.then(hash => {
				User.create( {
				  username: 'groupo',
				  password: hash, //ici on a le mot de passe hashé, c'est celui que l'on va pousser en bdd. 
				  surname: "damien",
				  name: "Will",
				  email: "damien.will@ingdev.fr",
				  department: "communication",
				  tel: "0387554870",
				  picture: "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fi.pinimg.com%2F736x%2F42%2F35%2F08%2F423508c9c018d86469115b7b0f620d65--photoshop-tutorial-adobe-photoshop.jpg&sp=1660213012T34336060a679aa509bc228a7bce02b6e0489979cde7bc9077ce7c8f34b25ec25"
				})
				.then(user => console.log(user.toJSON()))
			})
		  console.log('La base de donnée a bien été initialisée !') // j'affiche une indication de bonne connexion
	  })
  }

// ------------------ EXPORTATION ----------------
    // j'exporte la fonction initDb, les modèles "Post" et "user". On pourra réutiliser ces éléments ailleurs dans notre code. 
module.exports = { 
  initDb, 	
  Post,
  User
}
