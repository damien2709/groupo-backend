// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { User } = require('../src/db/sequelize')
const { Post } = require('../src/db/sequelize')
const multer = require('../src/middleware/multer-config')
const { ValidationError } = require('sequelize')
const fs = require('fs');

const auth = require('../src/auth/auth') 
  
module.exports = (app) => {
  
  app.put('/api/posts/:id', auth, multer, (req, res) => {
    const id = req.params.id;
    User.findByPk(req.body.user_id)
    .then(user => {
      Post.findByPk(id)
      .then(post => { 
        if(post.user_id == user.id || user.isAdmin){
            // ---------- la version si la requête comporte un fichier
            if(req.file){
              const filename = post.picture.split('/images/')[1]; 
              console.log("filename");
              fs.unlink(`images/${filename}`, (error => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.log("le  fichier a bien été supprimé du dossier images");
                }
              }));
              Post.update({
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                picture: `http://localhost:3000/${req.file.path}`,
                nbLike: req.body.nbLike,
                iLike: req.body.iLike,
                usersLike: req.body.usersLike,
              }, 
              {
                where: { id: id }
              })
              .then(_ => {
                return Post.findByPk(id)
                  .then(post => { 
                    if(post === null) {
                      const message = "L'article' demandé n'existe pas. Réessayez avec un autre identifiant."
                      return res.status(404).json({message}) 
                    }
                    else {
                    const message = `L'article' ${post.title} a bien été modifié.`
                    res.json({message, data: post })
                    }
                  })
              })
              .catch(error => {
                if(error instanceof ValidationError) {
                  return res.status(400).json({ message: error.message, data: error}) 
                }
                else {
                  const message = " L'article n'a pas pu être modifié. Réessayez dans quelques instants."
                  res.status(500).json({message, data: error}) 
                }
              })
              }
              // ---------------- Version sans fichier
            else {
                Post.update({
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                nbLike: req.body.nbLike,
                iLike: req.body.iLike,
                usersLike: req.body.usersLike,
                },  
                {where: { id: id }})
                .then(_ => {
                  return Post.findByPk(id)
                  .then(post => { 
                    if(post === null) {
                      const message = "L'article' demandé n'existe pas. Réessayez avec un autre identifiant."
                      return res.status(404).json({message}) 
                    }
                    else {
                    const message = `L'article' ${post.title} a bien été modifié.`
                    res.json({message, data: post })
                    }
                  })
              })
              .catch(error => { 
                if(error instanceof ValidationError) {
                  return res.status(400).json({ message: error.message, data: error}) 
                }
                else {
                  const message = " L'article n'a pas pu être modifié. Réessayez dans quelques instants."
                  res.status(500).json({message, data: error}) 
                }
              })
              }
                }
        // SI l'utilisateur n'est pas l'auteur du post ou admin
        else {
          Post.update({
            nbLike: req.body.nbLike,
            usersLike: req.body.usersLike,
          }, 
          {
            where: { id: id }
          })
          .then(_ => { console.log("les données de like ont bien été prises en compte")})
          .catch(error => { console.log(error.message)})
          const message = "L'utilisateur n'a pas les autorisations pour modifier le message !"
          return res.status(404).json({message})
        }
      
      })
      .catch((error) =>{
        console.log(error.message);
      })
    })
    .catch((error) =>{
      console.log(error.message);
    })
  })
}
