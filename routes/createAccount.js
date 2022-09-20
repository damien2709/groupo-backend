// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')
const bcrypt = require('bcrypt') 
const { ValidationError } = require('sequelize')  
const multer = require('../src/middleware/multer-config')
  
module.exports = (app) => {
 
  app.post('/api/users', multer, (req, res) => {
      bcrypt.hash(req.body.password, 10)
          .then(hash => {
            User.create({
              email: req.body.email,
              password: hash, //ici on a le mot de passe hashé, c'est celui que l'on va pousser en bdd. 
              surname: req.body.surname,
              name: req.body.name,
              department: req.body.department,
              tel: req.body.tel,           
              conditions: req.body.conditions,
              isAdmin: req.body.isAdmin,
              isLogged: req.body.isLogged,
            })
              .then(user => {
                const message = `L'utilisateur ${req.body.email} a bien été crée.`
                res.json({ message, data: user })
              })
          .catch(error => {
              if(error instanceof ValidationError) {
                  return res.status(400).json({ message: error.message, data: error}) 
              }
              else {
              // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
                const message = " L'utilisateur' n'a pas pu être créé. Réessayez dans quelques instants."
                res.status(500).json({message, data: error}) 
                }
          })
    })
    
  })
}
