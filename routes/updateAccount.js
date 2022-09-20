// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')
const bcrypt = require('bcrypt') 
const { ValidationError } = require('sequelize') 
const auth = require('../src/auth/auth') 
const multer = require('../src/middleware/multer-config')
const fs = require('fs');
  
module.exports = (app) => {
  app.put('/api/users/:id', auth, multer, (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
      .then(user => {
      // la version si la requête comporte un fichier
      if(req.file){
        const filename = user.picture.split('/images/')[1]; 
          console.log("filename");
          fs.unlink(`images/${filename}`, (error => {
            if (error) {
              console.log(error);
            }
            else {
              console.log("le  fichier a bien été supprimé du dossier images");
            }
        })); 
        User.update(
          {
            email: req.body.email,
            surname: req.body.surname,
            name: req.body.name,
            department: req.body.department,
            tel: req.body.tel,
            picture: `http://localhost:3000/${req.file.path}`, 
            conditions: req.body.conditions,
            isAdmin: req.body.isAdmin,
            isLogged: req.body.isLogged,
          }, 
          {where: { id: id }}
        ).then(_ => {
          User.findByPk(id)
            .then(user => { 
              if(user === null) {
                const message = "L'utilisateur' demandé n'existe pas. Réessayez avec un autre identifiant."
                return res.status(404).json({message}) 
              }
              else {
                const message = `L'utilisateur ${user.email} a bien été modifié.`
                res.json({message, data: user })
              }
            })
        })
        .catch(error => {
          
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) 
          }
          else {
            const message = " L'utilisateur' n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({message, data: error}) 
          }
        })
      }
      // la version si la requête ne comporte pas de fichier
      else {
        User.update(req.body, {where: { id: id }})
        .then(_ => {
          User.findByPk(id)
            .then(user => { 
              if(user === null) {
                const message = "L'utilisateur' demandé n'existe pas. Réessayez avec un autre identifiant."
                return res.status(404).json({message}) 
              }
              else {
                const message = `L'utilisateur ${user.username} a bien été modifié.`
                res.json({message, data: user })
              }
            })
        })
        .catch(error => {
          if(error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error}) 
          }
          else {
            const message = " L'utilisateur' n'a pas pu être modifié. Réessayez dans quelques instants."
            res.status(500).json({message, data: error}) 
          }
        })
      }
    })
    .catch((error) =>{
      console.log(error.message);
    })
  })
}
