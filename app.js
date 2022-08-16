// **** ROLE : DEMARRAGE SERVEUR NODE JS + CREATION API REST AVEC EXPRESS

// ------------ IMPORTATIONS ET VARIABLES ---------------
const express = require('express')  // on importe le module Express
const morgan = require('morgan') //j'importe le module-middleware de debugge en local "morgan"
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./src/db/sequelize') //on importe notre fichier de connexion à la bdd 'sequelize' 
const path = require('path');

// ------------ EXPRESS + SERVER -------------
const app = express()  //on crée une instance d'une application Express grâce à la méthode express. Ce sera notre petit serveur web sur lequel va fonctionner notre API REST. 
const port = 3000  //on définit une constante port : c'est le port par lequel on va passer avec notre serveur. 

//--------------- MIDDLEWARES ----------------------------
app
.use(favicon(__dirname + '/favicon.ico')) // on utilise le middleware favicon. Ne pas oublié de placer le fichier .ico dans le dossier sinon ca crache !
.use(morgan('dev')) //on utilise le middleware morgan dans notre API avec l'option "dev" pour optimiser l'affichage des messages de log pour le développement. la fonction 'next()' est automatiquement passée par Morgan, pas besoin de la déclarer !
.use(bodyParser.json()) // les données transitant par les requêtes entrantes et sortantes HTTP étant toujours sous forme de string, je dois parser les données entrantes pour les transformer en JSON et les utiliser avec javascript ! Je dois stringifier les données sortantes pour les transformer du JSON en string. 
.use(cors()) // on va utiliser le middleware cors pour implémnter la norme CORS sur toutes nos routes.
.use('/images', express.static(path.join(__dirname, './images'))) // ici je déclare le middleware path qui rend le dossier images statique. et qui spécifie en 1er argument la route pour les fichiers uploadés (donc la route est "/images") et en 2ème argument le dossier du projet qui contiendra les images (donc ici "./images")

// ------------ INITIALISATION DE LA BDD ----------------
sequelize.initDb()  // On appelle la méthode 'initDb' que l'on a définit dans le ficheir sequelize

// ----------------- POINTS DE TERMINAISON ----------------
    // GET
require('./routes/getAllPosts')(app) //on importe le fichier du point de terminaison qui est en fait une fonction qui prend un paramètre auquel on va donner la valeur 'app' qui est l'application Express. 

require('./routes/getOnePost')(app) // la route et le traitement pour voir un élément unique.

require('./routes/getYourAccount')(app) // la route et le traitement pour voir un élément unique.

    // POST
require('./routes/createAccount')(app) // la route et le traitement pour la création d'un compte utilisateur.

require('./routes/login')(app) // la route et le traitement pour l'authentification.

require('./routes/createPost')(app) // la route et le traitement pour créer un élément unique.

    // UPDATE
require('./routes/updateAccount')(app) // la route et le traitement pour modifier un compte user.

require('./routes/updatePost')(app) // la route et le traitement pour modifier un post.

// DELETE
require('./routes/deleteAccount')(app) // la route et le traitement pour créer un élément unique.

require('./routes/deletePost')(app) // la route et le traitement pour créer un élément unique.


// --------------------- GESTION DES ERREURS ---------------------
    //404
      // On créé un middleware qui va intercepté les réponses du client qui ne correspondent pas à nos routes déclarées précédemment, ce qui va nous permettre de personnaliser la réponse 404. 
      app.use(({res}) => {
        const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre url.'
        res.status(404).json({message}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
        }
      )
      

// ------------------ DEMARRAGE DE L'API SUR LE PORT DEDIE ----------------
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))  // On démarre l'API REST grace à la méthode "listen" qui prend 2 arguments : le port utilisé (3000) et une fonction : elle affiche un message de confirmation dans le terminal de commandes. 

