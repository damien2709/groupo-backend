// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.post('/api/posts', (req, res) => {
    Post.create(req.body)
      .then(post => {
        const message = `Le message ${req.body.title} a bien été crée.`
        res.json({ message, data: post })
      })
  })
}
