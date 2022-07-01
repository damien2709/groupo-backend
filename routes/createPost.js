// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.post('/api/posts', (req, res) => {
    Post.create(req.body)
      .then(post => {
        const message = `Le message ${req.body.title} a bien été crée.`
        res.json({ message, data: post })
      })
      .catch(error => {
        const message = " La liste des messages n'a pas pu être récupérée. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
      })
  })
}
