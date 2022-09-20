// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize') 
const auth = require('../src/auth/auth') 

module.exports = (app) => {
    app.get('/api/users', auth, (req, res) => {
        User.findAll({
          order: [
            ['created', 'ASC'] 
          ],
        }) 

        .then(users => {
          const message = 'La liste des utilisateurs a bien été récupérée.'
          res.json({ message, data: users }) 
        })
        .catch(error => {
          const message = " La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) 
        })
    }
)
}
