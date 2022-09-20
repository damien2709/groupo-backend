// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')

const auth = require('../src/auth/auth') 
  
module.exports = (app) => {
  app.get('/api/posts/:id', auth, (req, res) => {
    Post.findByPk(req.params.id)  
      .then(post => {
        if(post === null) {
          const message = "Le message demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) 
        }
        else {
        const message = 'Le message a bien été trouvé.'
        res.json({ message, data: post })
        }
      })
      .catch(error => {
        const message = "Le post demandé n'a pas pu être récupéré. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) 
      })

  })
}
