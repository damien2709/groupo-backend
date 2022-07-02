// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')

const { ValidationError } = require('sequelize') // On crée une constante issue de Sequelize pour la gestion des erreurs issues des validateurs internes à Sequelize. 
  
module.exports = (app) => {
  app.post('/api/posts', (req, res) => {
    Post.create(req.body)
      .then(post => {
        const message = `Le message ${req.body.title} a bien été crée.`
        res.json({ message, data: post })
      })
      .catch(error => {
        // Si l'erreur vient du coté client avec une invalidation des données, on va paramétrer une réponse code 400. 
          // On vérifie si l'erreur vient de Sequelize ou non. Si oui, c'est la faute du client donc erreur 400. 
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) // On peut passer le message d'erreur défini dans notre validateur du fichier de modèle post directement dans l'erreur envoyée au client grace à la méthode 'error.message'. 
          }
          // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " Le message n'a pas pu être créé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
        })
  
  })
}
