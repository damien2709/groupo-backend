// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
const { Post } = require('../src/db/sequelize')
const fs = require('fs');
const auth = require('../src/auth/auth') 
  
module.exports = (app) => {
  
  app.delete('/api/posts/:id', auth, (req, res) => {
    const id = req.params.id;
    User.findByPk(req.body.user_id)
    .then(user => {
      Post.findByPk(id)
        .then(post => {
          // On vérifie que le user est soit admin soit l'auteur du post
          if(post.user_id == user.id || user.isAdmin == true){
            if(post === null) {
              const message = "Le message demandé n'existe pas. Réessayez avec un autre identifiant."
              return res.status(404).json({message}) 
            }
            else {
            const postDeleted = post;
            return Post.destroy({
              where: { id: id }
            })
              .then(_ => {
                if(post.picture != null){
                  const filename = post.picture.split('/images/')[1]; 
                  console.log("filename");
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
                  res.status(500).json({message, data: error}) 
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
          res.status(500).json({message, data: error}) 
        })
      })
    .catch((error) =>{
      console.log(error.message);
    })
  })
}
