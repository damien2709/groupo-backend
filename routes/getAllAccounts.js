// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize') // On importe dans notre fichier le modèle de user qui définit la structure de la table 'users'
// Ensuite on exporte une fonction qui prend en paramètre l'application Express dans son entièreté. C'est ce qui nous permet de prendre en compte les routes dans app.js mais en ayant des fichiers de routes séparés et distincts. 

const {Op} = require('sequelize') // on importe les opérateurs de Sequelize pour trier les recherches de message par paramètres (titre, catégorie, ...). 

const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT

module.exports = (app) => {
  // la méthode 'get' de Express nous permet de passer 2 arguments : la route et un middleware. EN middleware, on va passer celui de la validation du token JWT, importé plus haut dans la constante 'auth'.
  // On introduit des paramètres de requêtes au début : 
        //------- en 1 : rechercher par catégorie de message.
    app.get('/api/users', auth, (req, res) => {
        // Ensuite, si on n'applique pas de paramètres de requête, on aura la liste complète des messages. On utilise la méthode findAll() qui retourne une promesse contenant la liste de toutes les instances (messages) présentes dans la BDD.
        User.findAll({
          order: [
            ['created', 'ASC'] //ici on va ordonner les résultats par date de création (avec la propriété 'created') et par odre croissant.
          ],
        }) 

        .then(users => {
          const message = 'La liste des utilisateurs a bien été récupérée.'
          res.json({ message, data: users }) // On retourne directement notre réponse à l'intérieur de la méthode res.json()
        })
        .catch(error => {
          const message = " La liste des utilisateurs n'a pas pu être récupérée. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
        })
    }
)
}
