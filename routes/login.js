// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON DEDIE A L'AUTHENTIFICATION ET APPLIQUER LA GESTION DES ERREURS

const { User } = require('../src/db/sequelize') // On importe dans notre fichier le modèle User qui définit la structure de la table 'users'
const bcrypt = require('bcrypt') // on en a besoin pour comparer les mots de passe
const jwt = require('jsonwebtoken')
const privateKey = require('../src/auth/private_key')

// déclaration du endpoint de l'authentification
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }) // récupération des paramètres de l'URL et requête vers la bdd pour récupérer les infos de l'utilisateur
        .then(user => {
            if(!user) { // on vérifie si l'utilisateur existe ou non. Si non, on retourne un message d'erreur avec le code de status 404 car la ressource n'a pas été trouvé.
                const message = "L'utilisateur demandé n'existe pas !"
                return res.status(404).json({ message })
            }
            else {
            bcrypt.compare(req.body.password, user.password) //On compare les 2 mots de passe grace à la méthode 'compare' de Bcrypt. La réponse (isPasswordValid) est un boolean. Si c'est "true", on laisse l'utilisateur se connecter et accèder à l'endpoint 
                .then(isPasswordValid => {
                    if(!isPasswordValid) { // on vérifie si le mot de passe est valide. Si non, on retourne un message d'erreur avec le code de status 401 car l'utilisateur n'a pas accès aux ressources. 
                        const message = `Le mot de passe n'est pas valide !`;
                        res.status(401).json({ message })
                    }
                    else {
                // JWT : on va générer un jeton JWT avec la méthode 'sign' du module jsonwebtToken. On le construit à l'aide de 3 informations : l'identifiant de l'utilisateur, la clé secrète et la date d'expiration. On récupère le jeton dans la constante 'token'. 
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
        .catch(error => { // ici on va gérer l'erreur générique. Ca correspond au cas d'un appel réseau qui échouerait. 
            const message = `L'utilisateur n'a pas pu se connecter. Réessayez dans quelques instants`;
            return res.status(500).json({ message, data: error })
        })
    })
}
    