// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
const fs = require('fs')
const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT

module.exports = (app) => {
  app.delete('/api/users/:id', auth, (req, res) => {
      // On commence par récupérer l'utilisateur avec la méthode 'findByPk()'. Ca permet de retourner dans la réponse  au client l'utilisateur qui a été supprimé . API de qualité !
    User.findByPk(req.params.id)
      .then(user => {
        if(user === null) {
          const message = "L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) // Ici on place un 'return' qui permet de mettre fin à l'instruction sans passer à la suite du code à l'intérieur du '.then'. Car avec la méthode 'res.json' de Express, cette dernière applique tout le code avant elle !
        }
        else {
          const userDeleted = user;
          // Ensuite, grace à la méthode 'destroy()' de Sequelize, on va pouvoir supprimer le pokemon. 
          return User.destroy({
            where: { id: user.id }
          })
            .then(_ => {
              const filename = user.picture.split('/images/')[1]; // ici on va spliter l'url de la photo du post pour ne garder que le dernier élément : le nom du fichier
              // ENsuite on va utiliser la fonction "unlink" de fs pour supprimer le fichier physiquement du dossier "images"
              fs.unlink(`images/${filename}`, (error => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log("le fichier a bien été supprimé du dossier images");
                }
              }))
              const message = `L'utilisateur' avec le nom d'utilisateur : ${userDeleted.username}, a bien été supprimé.`
              res.json({message, data: userDeleted })
            })
            .catch(error => {
              // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
                const message = " L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants."
                res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
              })
            }
      })
      // Ici je gère l'erreur 500 de la requête 'update' qui pourrait ne pas aboutir.
      .catch(error => {
        const message = " L'utilisateur' n'a pas pu être supprimé. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients
      })
  })
}
