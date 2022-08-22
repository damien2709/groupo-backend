// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')

const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT
  
module.exports = (app) => {
  // la méthode 'get' de Express nous permet de passer 2 arguments : la route et un middleware. EN middleware, on va passer celui de la validation du token JWT, importé plus haut dans la constante 'auth'.
  app.get('/api/users/:id', auth, (req, res) => {
    User.findByPk(req.params.id) // on a plus besoin de cette ligne de code : ' const id = parseInt(req.params.id) ' car la méthode findByPk() est capable de distinguer un "1" de 1. 
      .then(user => {
        // Pour gérer l'erreur 404, on va vérifier si le post demandé existe bien. La méthode 'findByPk' retourne 'null' si aucun post n'a été trouvé en bdd pour l'identifiant fourni en paramètre.  Donc en vérifiant si le résultat post est nul ou non, à la ligne 7, on est capable de déterminer si le post demandé par le client existe ou non.
        if(user === null) {
          const message = "L'utilisateur demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) // Ici on place un 'return' qui permet de mettre fin à l'instruction sans passer à la suite du code à l'intérieur du '.then'. Car avec la méthode 'res.json' de Express, cette dernière applique tout le code avant elle !
        }
        else {
        const message = "L'utilisateur a bien été trouvé."
        res.json({ message, data: user })
        }
      })

    	// Pour gérer l'erreur 500, on va utiliser la méthode '.catch()'
      .catch(error => {
        const message = "L'utilisateur demandé n'a pas pu être récupéré. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
      })

  })
}