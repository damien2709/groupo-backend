// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.delete('/api/users/:id', (req, res) => {
      // On commence par récupérer l'utilisateur avec la méthode 'findByPk()'. Ca permet de retourner dans la réponse  au client l'utilisateur qui a été supprimé . API de qualité !
    User.findByPk(req.params.id).then(user => {
      const userDeleted = user;
      // Ensuite, grace à la méthode 'destroy()' de Sequelize, on va pouvoir supprimer le pokemon. 
      User.destroy({
        where: { id: user.id }
      })
      .then(_ => {
        const message = `L'utilisateur' avec le nom d'utilisateur : ${userDeleted.username}, a bien été supprimé.`
        res.json({message, data: userDeleted })
      })
      .catch(error => {
        // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " L'utilisateur' n'a pas pu être supprimé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
        })
  })
})
}
