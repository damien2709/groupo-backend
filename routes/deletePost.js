// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
const { Post } = require('../src/db/sequelize')
const fs = require('fs');
const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT
  
module.exports = (app) => {
  // la méthode 'delete' de Express nous permet de passer 2 arguments : la route et un middleware. EN middleware, on va passer celui de la validation du token JWT, importé plus haut dans la constante 'auth'.
  app.delete('/api/posts/:id', auth, (req, res) => {
    const id = req.params.id;
    // Je récupère le user qui a ecrit le post car il y a une association one to many
    User.findByPk(req.body.user_id)
    .then(user => {
      // Je cherche maintenant mon post
      Post.findByPk(id)
        .then(post => {
          // On vérifie que le user est soit admin soit l'auteur du post
          if(post.user_id == user.id || user.isAdmin == true){
            if(post === null) {
              const message = "Le message demandé n'existe pas. Réessayez avec un autre identifiant."
              return res.status(404).json({message}) // Ici on place un 'return' qui permet de mettre fin à l'instruction sans passer à la suite du code à l'intérieur du '.then'. Car avec la méthode 'res.json' de Express, cette dernière applique tout le code avant elle !
            }
            else {
            const postDeleted = post;
            // Ensuite, grace à la méthode 'destroy()' de Sequelize, on va pouvoir supprimer le pokemon. On utilise l'instruction 'return' qui permet de factoriser (mutualiser) la gestion de l'erreur 500 ( car il y a 2 requêtes : findByPk() et destroy()). Voir fichier 
            return Post.destroy({
              where: { id: id }
            })
              .then(_ => {
                if(post.picture != null){
                  const filename = post.picture.split('/images/')[1]; // ici on va spliter l'url de la photo du post pour ne garder que le dernier élément : le nom du fichier
                  console.log("filename");
                  // ENsuite on va utiliser la fonction "unlink" de fs pour supprimer le fichier physiquement du dossier "images"
                  fs.unlink(`images/${filename}`, (error => {
                    if (error) {
                      console.log(error);
                    }
                    else {
                      console.log("le  fichier a bien été supprimé du dossier images");
                    }
                  }))
                  const message = `Le message avec l'identifiant n°${postDeleted.id} a bien été supprimé.`
                  res.json({message, data: postDeleted })
                }
                else{
                  const message = `Le message avec l'identifiant n°${postDeleted.id} a bien été supprimé.`
                  res.json({message, data: postDeleted })
                }
              })
              .catch(error => {
                // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
                  const message = " Le post n'a pas pu être supprimé. Réessayez dans quelques instants."
                  res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
                })
            }
            }
          else {
            const message = "L'utilisateur n'a pas les autorisations pour supprimer le message !"
            return res.status(404).json({message})
          }
        })
        // Ici je gère l'erreur 500 de la requête 'delete' qui pourrait ne pas aboutir.
        .catch(error => {
          const message = " Le message n'a pas pu être trouvé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients
        })
      })
    .catch((error) =>{
      console.log(error.message);
    })
  })
}
