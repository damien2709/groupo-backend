// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')
const bcrypt = require('bcrypt') // on en a besoin pour comparer les mots de passe
const { ValidationError } = require('sequelize') // On crée une constante issue de Sequelize pour la gestion des erreurs issues des validateurs internes à Sequelize. 
  
module.exports = (app) => {
  // la méthode 'post' de Express nous permet de passer 2 arguments : la route et un middleware. Pas besoin du middleware d'authentification pour la création d'un compte. Par contre on utilise la méthode "hash" de Bcrypt pour encrypter le mot de passe et créer l'utilisateur (selon le modèle User). 
  app.post('/api/createAccount', (req, res) => {
    bcrypt.hash(req.body.password, 10)
          .then(hash => {
            User.create({
              username: req.body.username,
              password: hash, //ici on a le mot de passe hashé, c'est celui que l'on va pousser en bdd. 
              surname: req.body.surname,
              name: req.body.name,
              email: req.body.email,
              department: req.body.department,
              tel: req.body.tel,
              picture: req.body.picture,
              conditions: req.body.conditions,
              isAdmin: req.body.isAdmin,
              isLogged: req.body.isLogged
            })
              .then(user => {
                const message = `L'utilisateur ${req.body.username} a bien été crée.`
                res.json({ message, data: user })
              })
          .catch(error => {
              // Si l'erreur vient du coté client avec une invalidation des données, on va paramétrer une réponse code 400. 
              // On vérifie si l'erreur vient de Sequelize ou non. Si oui, c'est la faute du client donc erreur 400. 
              if(error instanceof ValidationError) {
                  return res.status(400).json({ message: error.message, data: error}) // On peut passer le message d'erreur défini dans notre validateur du fichier de modèle post directement dans l'erreur envoyée au client grace à la méthode 'error.message'. 
              }
              else {
              // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
                const message = " L'utilisateur' n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
                }
          })
  
    })
  })
}
