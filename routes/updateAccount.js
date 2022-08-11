// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { User } = require('../src/db/sequelize')
const bcrypt = require('bcrypt') // on en a besoin pour comparer les mots de passe
const { ValidationError } = require('sequelize') // On crée une constante issue de Sequelize pour la gestion des erreurs issues des validateurs internes à Sequelize.
const auth = require('../src/auth/auth') // J'importe mon middleware de vérification et validation du jeton JWT
  
module.exports = (app) => {
  // la méthode 'update' de Express nous permet de passer 2 arguments : la route et un middleware. EN middleware, on va passer celui de la validation du token JWT, importé plus haut dans la constante 'auth'.
  app.put('/api/users/:id', auth,(req, res) => {
    const id = req.params.id
    // on applique la méthode update() de Sequelize. Elle ne renvoie malheureusement pas de réponse. Il va falloir créer une réponse en s'appuyant sur la méthode 'findByPk' de Sequelize. 
    User.update(req.body, {where: { id: id },})
    .then(_ => {
       User.findByPk(id)
        .then(user => { // on récupère le pokemon avec un certain identifiant en base de données pour l'afficher au client . API de qualité ! En appliquant l'instruction 'return' à la méthode 'findyPk', cela permet de transmettre l'erreur éventuelle de la méthode 'findByPk' au bloc '.catch()' situé plus bas dans le code. Cela nous permet de traiter toutes les erreurs 500 en une seule fois.  
        // Pour gérer l'erreur 404, on va vérifier si le user demandé existe bien. La méthode 'findByPk' retourne 'null' si aucun user n'a été trouvé en bdd pour l'identifiant fourni en paramètre.  Donc en vérifiant si le résultat user est nul ou non, à la ligne 7, on est capable de déterminer si le user demandé par le client existe ou non.
          if(user === null) {
            const message = "L'utilisateur' demandé n'existe pas. Réessayez avec un autre identifiant."
            return res.status(404).json({message}) // Ici on place un 'return' qui permet de mettre fin à l'instruction sans passer à la suite du code à l'intérieur du '.then'. Car avec la méthode 'res.json' de Express, cette dernière applique tout le code avant elle !
          }
          else {
          const message = `L'utilisateur ${user.username} a bien été modifié.`
          res.json({message, data: user })
          }
        })
    })
    // Ici je gère les erreurs
    .catch(error => {
      // Si l'erreur vient du coté client avec une invalidation des données, on va paramétrer une réponse code 400. 
          // On vérifie si l'erreur vient de Sequelize ou non. Si oui, c'est la faute du client donc erreur 400. 
      if(error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error}) // On peut passer le message d'erreur défini dans notre validateur du fichier de modèle post directement dans l'erreur envoyée au client grace à la méthode 'error.message'. 
      }
      else {
      // Si l'erreur vient du coté serveur, on va paramétrer une réponse code 500.
        const message = " L'utilisateur' n'a pas pu être modifié. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
      }
    })

  })
}
