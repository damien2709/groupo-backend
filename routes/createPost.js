// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
const multer = require('../src/middleware/multer-config')
const { ValidationError } = require('sequelize') 

const auth = require('../src/auth/auth') 
  
module.exports = (app) => {
  app.post('/api/posts', auth, multer, (req, res) => {
    const user = {
      id: req.body.userId,
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
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) 
          }
          else {
          // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " Le message n'a pas pu être créé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) 
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
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) 
          }
          else {
          // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
          const message = " Le message n'a pas pu être créé. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) 
          } 
        })
    }
  })
}
