// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.get('/api/posts/:id', (req, res) => {
    Post.findByPk(req.params.id) // on a plus besoin de cette ligne de code : ' const id = parseInt(req.params.id) ' car la méthode findByPk() est capable de distinguer un "1" de 1. 
      .then(post => {
        const message = 'Le message a bien été trouvé.'
        res.json({ message, data: post })
      })
  })
}
