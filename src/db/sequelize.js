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


// ----------------- DECLARATION DES TABLES ET ASSOCIATIONS-----------
 // On crée une table dans la BDD, associé à un modèle Sequelize
const Post = PostModel(sequelize, DataTypes) // On passe en paramètres les 2 qui sont attendus par notre modèle
const Comment = CommentModel(sequelize, DataTypes) // On passe en paramètres les 2 qui sont attendus par notre modèle 
const User = UserModel(sequelize, DataTypes) // On instancie auprès de Sequelize notre modèle User

 // On va créer une relation 'one to many' entre le modèle User (parent) et le modèle Post (enfant). Comme la clé étrangère est dans le modèle de destination (enfant) et qu'ici on est dans le modèle parent, je vais paramétrer ici l'association via la méthode 'hasMany'. 
User.hasMany(Post, 
    {
		foreignKey: {
			name: 'user_id',
			type: DataTypes.INTEGER, 

		},
		onDelete: 'CASCADE', 
		onUpdate: 'CASCADE',
	});
// On va créer une relation 'one to many' entre le modèle User (parent) et le modèle Post (enfant). Comme la clé étrangère est dans le modèle 'enfant' et que l'on est donc dans le module enfant, je vais paramétrer ici l'association via la méthode 'belongsTo'. 
Post.belongsTo(User,
	{
		foreignKey: 'user_id'
	}); 

// ----------------- SYNCHRONISATION de la BDD avec création des tables et ajout direct de avec nouveaux posts, comments et user-----------

// On synchronise la BDD en créant la fonction 'initDb' et en lui passant des modèles
const initDb = () => {
	return sequelize.sync({force: true}) //force:true permet de supprimer la table associée au modèle avant chaque synchronisation. On perd les données précédentes mais ça nous facilite la vie dans la phase de développement. Par exemple, pour apporter des modifications de modèles sans se trimballer les anciennes propriétés qui ont disparus du modèle. 
	  .then(_ => {
			// on pousse un nouvel utilisateur admin en bdd grace à la méthode 'create', avec un mot de passe hashé grace à bcrypt: 
			bcrypt.hash('Groupo2709@', 10)
				.then(hash => {
					User.create( {
					email: "admin@ingdev.fr",
					password: hash, //ici on a le mot de passe hashé, c'est celui que l'on va pousser en bdd. 
					surname: "Damien",
					name: "Will",
					department: "communication",
					tel: "0387554870",
					picture: 'http://localhost:3000/images/unknownUser.jpg',
					isAdmin: true,
					})
				// ensuite on récupère le nouvel utilisateur 'user' puis on crée des posts qui reprendront son id, car il y a une association one to many entre les deux. . Les posts sont dans le scope du user (dans son .'then'). Je crée des nouvelles instances de post avec la méthode create de mon modèle. Je ne passe ni son ID ni sa date de création, c'est la BDD qui s'en occupe ! Je vais imbriquer les posts dans le user créé puis les commentaires dans les posts créés. Pour faire ça, je rentre dans les scopes des then. 
				//Grace à la méthode .map(), je peux boucler sur la liste statique des différents posts qui est déclarée dans mock-posts.js et importée.  Ca me permet de pousser directement, lors du démarrage de notre API REST, 3 posts en Base de données. 
				.then(user => {
					console.log(user.toJSON());
					postBdd.map(post => {
						Post.create({
							title: post.title,
							content: post.content,
							category: post.category,
							picture: post.picture,
							nbLike: post.nbLike,
							iLike: post.iLike,
							usersLike: post.usersLike,
							user_id: user.id,
					  	})
						.then(post => {
							console.log(post.toJSON()); // on demande à Sequelize de faire une requête à la BDD pour demander si chaque post a bien été créé, et on attend sa réponse en asynchrone. Elle arrive en JSON (pour afficher correctement les informations d'une instance d'un modèle) car la méthode 'toJSON' permet de n'afficher en JSOn que les valeurs qui nous interessent (et pas celles en interne de Sequelize). 
							// Dans le scope du post crée (dans le then), on va également créer les commentaires associés à chaque post avec des commentaires qui reprendront l'id de chaque post car il y a une association one to many entre les deux. 
							commentBdd.map(comment => {
								Comment.create({
									authorId: comment.authorId,
									postId: comment.postId,
									content: comment.content,
									picture: comment.picture,
									like: comment.like
								})
								.then(comment => console.log(comment.toJSON())) 
								})
						}) // on demande à Sequelize de faire une requête à la BDD pour demander si chaque post a bien été créé, et on attend sa réponse en asynchrone. Elle arrive en JSON (pour afficher correctement les informations d'une instance d'un modèle) car la méthode 'toJSON' permet de n'afficher en JSOn que les valeurs qui nous interessent (et pas celles en interne de Sequelize). 
					})
				})
			})

			  
		  console.log('La base de donnée a bien été initialisée !') // j'affiche une indication de bonne connexion
	  })
	  .catch((err) => {
		console.log(err);
		})
  }

// ------------------ EXPORTATION ----------------
    // j'exporte la fonction initDb, les modèles "Post" et "user". On pourra réutiliser ces éléments ailleurs dans notre code. 
module.exports = { 
  initDb, 	
  Post,
  User
}
