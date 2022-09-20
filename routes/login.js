// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON DEDIE A L'AUTHENTIFICATION ET APPLIQUER LA GESTION DES ERREURS

const { User } = require('../src/db/sequelize') 
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
const privateKey = require('../src/auth/private_key')

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { email: req.body.email } }) 
        .then(user => {
            if(!user) { 
                const message = "L'utilisateur demandé n'existe pas !"
                return res.status(404).json({ message })
            }
            else {
            bcrypt.compare(req.body.password, user.password) 
                .then(isPasswordValid => {
                    if(!isPasswordValid) { 
                        const message = `Le mot de passe n'est pas valide !`;
                        return res.status(401).json({ message })
                    }
                    else {
                // JWT : génération token 
                    const token = jwt.sign(
                        { userId: user.id},
                        privateKey,
                        { expiresIn:  '24h'}
                    )

                    const message = `L'utilisateur a été connecté avec succès`;
                    return res.json({ message, data: user, token })
                    }
                })
            }
            })
        .catch(error => { 
            const message = `L'utilisateur n'a pas pu se connecter. Réessayez dans quelques instants`;
            return res.status(500).json({ message, data: error })
        })
    })
}
    