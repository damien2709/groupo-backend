// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON
const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.delete('/api/posts/:id', (req, res) => {
      // On commence par récupérer le post avec la méthode 'findByPk()'. Ca permet de retourner dans la réponse  au client le post qui a été supprimé . API de qualité !
    Post.findByPk(req.params.id).then(post => {
      const postDeleted = post;
      // Ensuite, grace à la méthode 'destroy()' de Sequelize, on va pouvoir supprimer le pokemon. 
      Post.destroy({
        where: { id: post.id }
      })
      .then(_ => {
        const message = `Le message avec l'identifiant n°${postDeleted.id} a bien été supprimé.`
        res.json({message, data: postDeleted })
      })
    })
  })
}
