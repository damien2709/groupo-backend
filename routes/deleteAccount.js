// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
const fs = require('fs')
const auth = require('../src/auth/auth') 

module.exports = (app) => {
  app.delete('/api/users/:id', auth, (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        if(user === null) {
          const message = "L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) 
        }
        else {
          const userDeleted = user;
          
          return User.destroy({
            where: { id: user.id }
          })
            .then(_ => {
              const filename = user.picture.split('/images/')[1]; 
              fs.unlink(`images/${filename}`, (error => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log("le fichier a bien été supprimé du dossier images");
                }
              }))
              const message = `L'utilisateur' avec le nom d'utilisateur : ${userDeleted.email}, a bien été supprimé.`
              res.json({message, data: userDeleted })
            })
            .catch(error => {
              // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
                const message = " L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants."
                res.status(500).json({message, data: error}) 
              })
            }
      })
      // Ici je gère l'erreur 500 de la requête 'update' qui pourrait ne pas aboutir.
      .catch(error => {
        const message = " L'utilisateur' n'a pas pu être supprimé. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) 
      })
  })
}
