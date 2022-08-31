// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')
const { Post } = require('../src/db/sequelize')
const multer = require('../src/middleware/multer-config')
const { ValidationError } = require('sequelize') // On crée une constante issue de Sequelize pour la gestion des erreurs issues des validateurs internes à Sequelize. 

const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT
  
module.exports = (app) => {
  // la méthode 'post' de Express nous permet de passer 2 arguments : la route et un middleware. EN middleware, on va passer celui de la validation du token JWT, importé plus haut dans la constante 'auth'.
  app.post('/api/posts', auth, multer, (req, res) => {
    // Je récupère le user qui a ecrit le post car il y a une association one to many
    const user = {
      id: req.body.authorId,
    }
    console.log(user);
    // version avec fichier
    if(req.file){
      Post.create({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        picture: `http://localhost:3000/${req.file.path}`,
        nbLike: req.body.nbLike,
        iLike: req.body.iLike,
        usersLike: req.body.usersLike,
        user_id: user.id,

    })
      .then(post => {
        const message = `Le message a bien été crée.`
        res.json({ message, data: post })
      })
      .catch(error => {
        // Si l'erreur vient du coté client avec une invalidation des données, on va paramétrer une réponse code 400. 
          // On vérifie si l'erreur vient de Sequelize ou non. Si oui, c'est la faute du client donc erreur 400. 
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) // On peut passer le message d'erreur défini dans notre validateur du fichier de modèle post directement dans l'erreur envoyée au client grace à la méthode 'error.message'. 
          }
          else {
          // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " Le message n'a pas pu être créé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients.
          } 
        })
    }
    //version sans fichier
    else {
      Post.create({
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        nbLike: req.body.nbLike,
        iLike: req.body.iLike,
        usersLike: req.body.usersLike,
        user_id: user.id,


    })
      .then(post => {
        const message = `Le message a bien été crée.`
        res.json({ message, data: post })
      })
      .catch(error => {
        // Si l'erreur vient du coté client avec une invalidation des données, on va paramétrer une réponse code 400. 
          // On vérifie si l'erreur vient de Sequelize ou non. Si oui, c'est la faute du client donc erreur 400. 
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) // On peut passer le message d'erreur défini dans notre validateur du fichier de modèle post directement dans l'erreur envoyée au client grace à la méthode 'error.message'. 
          }
          else {
          // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " Le message n'a pas pu être créé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients.
          } 
        })
    }
  })
}
