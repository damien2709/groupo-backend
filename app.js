// **** ROLE : DEMARRAGE SERVEUR NODE JS + CREATION API REST AVEC EXPRESS

// ------------ IMPORTATIONS ET VARIABLES ---------------

const express = require('express')  // on importe le module Express
let postsBdd = require('./mock-posts') //on importe la constante "pokemons" du fichier "mock-pokemon.js" qui est notre base de données internes.

const { success } = require('./helper') //syntaxe ES6 d'importation d'une méthode d'un fichier plutôt que du fichier complet. La méthode que l'on a créé nous permet de transmettre une réponse complète avec un message et des datas.

const morgan = require('morgan') //j'importe le module-middleware de debugge en local "morgan"

const favicon = require('serve-favicon')

const bodyParser = require('body-parser') 

const { Sequelize, DataTypes } = require('sequelize') //syntaxe ES6 d'importation d'une méthode d'un fichier plutôt que du fichier complet. On importe l'ORM Sequelize pour communiquer avec la BDD sur MAMP. On importe également l'objet 'DataTypes' qui contient les types disponibles dans Sequelize pour définir les types de données contenus dans les propriétés du modèle. 

const mysql = require('mysql2')
  
const app = express()  //on crée une instance d'une application Express grâce à la méthode express. Ce sera notre petit serveur web sur lequel va fonctionner notre API REST. 
const port = 3000  //on définit une constante port : c'est le port par lequel on va passer avec notre serveur. 

const PostModel = require('./src/models/modelPost')

//--------------- CONNEXION BDD ----------------------------
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

sequelize.authenticate()
	.then(_ => console.log('La connexion à la BDD a bien été établie'))
	.catch(error => console.log('Impossible de se connecter à la BDD ${error}'))

// Après la partie authentification à la BDD, On crée une table dans la BDD, associé à un modèle Sequelize
const Post = PostModel(sequelize, DataTypes) // On passe en paramètres les 2 paramètres attendus par notre modèle 


// On synchronise la BDD 
sequelize.sync({force: true}) //force:true permet de supprimer la table associée au modèle avant chaque synchronisation. On perd les données précédentes mais ça nous facilite la vie dans la phase de développement. Par exemple, pour apporter des modifications de modèles sans se trimballer les anciennes propriétés qui ont disparus du modèle. 
  .then(_ => {
    console.log('La base de données "groupomania" a bien été synchronisée!')
    // je crée une nouvelle instance de pokemon avec la méthode create de mon modèle. Je ne passe ni son ID ni sa date de création, c'est la BDD qui s'en occupe !
    Post.create({
		title: "Soirée pizza",
		content: "Salut à toutes et tous, ce soir le département communication vous invite à se retrouver au bar du Vanguard pour un petit apéro-pizzas !",
		picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
		like: 0,
          
      }).then(post => console.log(post.toJSON())) // on demande à Sequelize de faire une requête à la BDD pour demander si Bulbizzare a bien été créé, et on attend sa réponse en asynchrone. Elle arrive en JSON (pour afficher correctement les informations d'une instance d'un modèle) car la méthode 'toJSON' permet de n'afficher en JSOn que les valeurs qui nous interessent (et pas celles en interne de Sequelize). 
  })


//--------------- MIDDLEWARES ----------------------------

app
.use(favicon(__dirname + '/favicon.ico')) // on utilise le middleware favicon. Ne pas oublié de placer le fichier .ico dans le dossier sinon ca crache !
.use(morgan('dev')) //on utilise le middleware morgan dans notre API avec l'option "dev" pour optimiser l'affichage des messages de log pour le développement. la fonction 'next()' est automatiquement passée par Morgan, pas besoin de la déclarer !
.use(bodyParser.json()) // les données transitant par les requêtes entrantes et sortantes HTTP étant toujours sous forme de string, je dois parser les données entrantes pour les transformer en JSON et les utiliser avec javascript ! Je dois stringifier les données sortantes pour les transformer du JSON en string. 

// ------------- ROUTES ----------------------------------

    // ---- Routes GET ----
app.get('/', (req, res) => res.send('Hello from your application Express!')) 

app.get('/api/posts', (req, res) => {
    const messageFront = "Vous avez demandé la liste des posts"
	res.json({ messageFront, data: posts }) // On retourne directement notre réponse à l'intérieur de la méthode res.json()
})

app.get('/api/posts/:id', (req, res) => {
	const id = parseInt(req.params.id) // l'id récupéré est sous forme de string, il faudra utiliser "parseInt" pour le transformer en nombre !
    const post = posts.find(el => el.id === id)
    const messageFront = `Vous avez demandé le post intitulé : ${post.title}`
    res.json(success(messageFront, post))
    } 
)

    // ---- Routes POST ----
app.post('/api/posts', (req, res) => {
    const id = 123
    const postCreated = { ...req.body, ...{id: id, created: new Date()}} // On fusionne les données du pokemon reçues via la requête HTTP entrante avec l'identifiant unique que l'on a généré, même si ce dernier n'est pas très fiable. On en profite pour ajouter au pokemon la date de création. Pour la copie, on utilise un spread operator … qui permet de faire une copie indépendante de variables. On crée un nouvel objet qui comprend le corps de la requête, un id et une date de création. Le spread operator recopie le corps de la requête (donc son contenu envoyé par le front), il copie également la variable id créée précédemment et la date de création. 
    posts.push(postCreated)
    const message = `Le message ${postCreated.title} a bien été crée.`
    res.json(success(message, postCreated))
})

    // ---- Routes PUT ----
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // on effectue la modification du pokémon :
    const postUpdated = { ...req.body, id: id }
    posts = posts.map(post => {
        return post.id === id ? postUpdated : post
    }) // On réalise une mise à jour de la liste globale des pokémons en remplaçant l'ancien pokémon dans la liste par le nouveau pokémon modifié. Le traitement est possible grace à la méthode native "map". Pour chaque pokémon de la liste, on retourne exactement le même pokémon sauf s'il s'agit du pokémon à modifier. C'est possible grace à l'opérateur conditionnel ternaire. On obtient ainsi la liste des pokémons à jour avec la modification demandée par le client.
      
    //on construit notre réponse :
    const message = `Le post ${postUpdated.title} a bien été modifié.`
    res.json(success(message, postUpdated))
});

    // ---- Routes PUT ----
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const postDeleted = posts.find(post => post.id === id)
    posts = posts.filter(post => post.id !== id) //On se sert de la méthode "filter" avec laquelle on obtient une nouvelle liste de pokemon mais sans le pokemon supprimé. 
    const message = `Le message ${postDeleted.title} a bien été supprimé.`
    res.json(success(message, postDeleted))
});
            
  
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))  // On démarre l'API REST grace à la méthode "listen" qui prend 2 arguments : le port utilisé (3000) et une fonction : elle affiche un message de confirmation dans le terminal de commandes. 

