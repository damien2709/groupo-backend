// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')

const auth = require('../src/auth/auth') 
  
module.exports = (app) => {
  
  app.get('/api/users/:id', auth, (req, res) => {
    User.findByPk(req.params.id) 
      .then(user => {
        if(user === null) {
          const message = "L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) 
        }
        else {
        const message = "L'utilisateur a bien été trouvé."
        res.json({ message, data: user })
        }
      })
      .catch(error => {
        const message = "L'utilisateur demandé n'a pas pu être récupéré. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) 
      })

  })
}
