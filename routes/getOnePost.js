// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize')
  
module.exports = (app) => {
  app.get('/api/posts/:id', (req, res) => {
    Post.findByPk(req.params.id) // on a plus besoin de cette ligne de code : ' const id = parseInt(req.params.id) ' car la méthode findByPk() est capable de distinguer un "1" de 1. 
      .then(post => {
        // Pour gérer l'erreur 404, on va vérifier si le post demandé existe bien. La méthode 'findByPk' retourne 'null' si aucun post n'a été trouvé en bdd pour l'identifiant fourni en paramètre.  Donc en vérifiant si le résultat post est nul ou non, à la ligne 7, on est capable de déterminer si le post demandé par le client existe ou non.
        if(post === null) {
          const message = "Le message demandé n'existe pas. Réessayez avec un autre identifiant."
          return res.status(404).json({message}) // Ici on place un 'return' qui permet de mettre fin à l'instruction sans passer à la suite du code à l'intérieur du '.then'. Car avec la méthode 'res.json' de Express, cette dernière applique tout le code avant elle !
        }

        const message = 'Le message a bien été trouvé.'
        res.json({ message, data: post })
      })

    	// Pour gérer l'erreur 500, on va utiliser la méthode '.catch()'
      .catch(error => {
        const message = "Le post demandé n'a pas pu être récupéré. Réessayez dans quelques instants."
        res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
      })

  })
}
