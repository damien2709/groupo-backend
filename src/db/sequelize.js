// **** ROLE : INITIALISATION, CONNEXION ET COMMUNICATION AVEC LA BDD

// ------------------ IMPORTATIONS -----------------
const { Sequelize, DataTypes } = require('sequelize') 
const PostModel = require('../models/postModel.js') 
const UserModel = require('../models/userModel.js') 
const postBdd = require('./mock-posts.js')
const bcrypt = require('bcrypt')  

// ---------------- CONNEXION A LA BDD ----------------

const sequelize = new Sequelize(
	'groupomania', // C'est le nom de la BDD que l'on veut créer
	'root', // C'est l'identifiant permettant d'accéder à la BDD, par défaut l'id est "root"
	'root', // C'est le mot de passe de la BDD pour l'utilisateur, par défaut. . 
	// objet de configuration : 
	{
	  host: 'localhost', 
	  port: '8889', 
	  dialect: 'mysql', 
	  })

    // On teste la connexion à la BDD 
sequelize.authenticate()
	.then(_ => console.log('La connexion à la BDD a bien été établie'))
	.catch(error => console.log('Impossible de se connecter à la BDD ${error}'))


// ----------------- DECLARATION DES TABLES ET ASSOCIATIONS-----------

const Post = PostModel(sequelize, DataTypes) 
const User = UserModel(sequelize, DataTypes) 

 // On va créer une relation 'one to many' entre le modèle User (parent) et le modèle Post (enfant). 
User.hasMany(Post, 
    {
		foreignKey: {
			name: 'user_id',
			type: DataTypes.INTEGER, 

		},
		onDelete: 'CASCADE', 
		onUpdate: 'CASCADE',
	});
// On va créer une relation 'one to many' entre le modèle User (parent) et le modèle Post (enfant). 
Post.belongsTo(User,
	{
		foreignKey: 'user_id'
	}); 

// ----------------- SYNCHRONISATION de la BDD avec création des tables et ajout direct de avec nouveaux posts, comments et user-----------

const initDb = () => {
	return sequelize.sync({force: true}) 
	  .then(_ => {
			// on pousse un nouvel utilisateur admin en bdd 
			bcrypt.hash('Groupo2709@', 10)
				.then(hash => {
					User.create( {
					email: "admin@groupomania.fr",
					password: hash, 
					surname: "Damien",
					name: "Will",
					department: "communication",
					tel: "0387554870",
					picture: 'http://localhost:3000/profilPicture/unknownUser.jpg',
					isAdmin: true,
					})
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
							console.log(post.toJSON()); 
						})
						.catch((err) => {
							console.log(err);
							})
					})
				})
			})  
		  console.log('La base de donnée a bien été initialisée !') 
	  })
	  .catch((err) => {
		console.log(err);
		})
  }

// ------------------ EXPORTATION ----------------

module.exports = { 
  initDb, 	
  Post,
  User
}
