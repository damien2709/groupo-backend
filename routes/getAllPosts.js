// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize') 
const {Op} = require('sequelize') 
const auth = require('../src/auth/auth') 

module.exports = (app) => {
    app.get('/api/posts', auth, (req, res) => {
      //------- en 1 : rechercher par catégorie de message.
      if (req.query.category) { 
        const category = req.query.category
        return Post.findAll ({ 
          where: { 
            category: category
          },
          order: [
            ['created', 'DESC'] 
          ],
        }) 
        .then(posts => {
          const message = `il y a ${posts.length} message(s) appartenant à la catégorie ${category}.`
          res.json({ message, data: posts }) 
        })
      }
      //------- en 2 : rechercher par titre large de message.
      else if (req.query.content) { 
        const content = req.query.content
        return Post.findAll({ 
          where: { 
            [Op.or] : [
              {content: { 
                [Op.like]: `%${content}%`}, 
              },
              {title: { 
                [Op.like]: `%${content}%`}, 
              }
          ]
          },
          order: [
            ['created', 'DESC'] 
          ],
        })
        .then(posts => {
          const message = `il y a ${posts.length} messages correspondant à la recherche ${content}.`
          res.json({ message, data: posts }) 
        })
      }
      //------- en 3 : rechercher par posts de l'utilisateur.
      else if (req.query.userId) {  
        const userId = req.query.userId
        return Post.findAll ({ 
          where: { 
            user_id: userId
          },
          order: [
            ['created', 'DESC'] 
          ],
        }) 
        .then(posts => {
          const message = `il y a ${posts.length} message(s) appartenant à l'utilisateur.`
          res.json({ message, data: posts }) 
        })
      }
        // Si pas de recherche spécifique : 
      else {
        Post.findAll({
          order: [
            ['created', 'DESC'] 
          ],
        }) 

        .then(posts => {
          const message = 'La liste des posts a bien été récupérée.'
          res.json({ message, data: posts }) 
        })
        .catch(error => {
          const message = " La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) 
        })
    }
})
}
