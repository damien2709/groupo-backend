// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.put('/api/posts/:id', (req, res) => {
    const id = req.params.id
    // on applique la méthode update() de Sequelize. Elle ne renvoie malheureusement pas de réponse. Il va falloir créer une réponse en s'appuyant sur la méthode 'findByPk' de Sequelize. 
    Post.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      Post.findByPk(id).then(post => { // on récupère le pokemon avec un certain identifiant en base de données
        const message = `Le message ${post.title} a bien été modifié.`
        res.json({message, data: post })
      })
    })
  })
}
