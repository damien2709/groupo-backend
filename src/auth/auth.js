// *********** ROLE : VERIFICATION DU JETON JWT POUR SECURISATION DES ECHANGES DE DONNEES

const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization //ici on récupère dans la requête l'entête http nommée "autorization". C'est dans cette entête que transitera le jeton JWT envoyé au client. 
  
  // On vérifie que le jeton a bien été fourni. Si c'est bon, on passe direct à la fin du middleware avec next() pour passer au middleware suivant. Sinon, on envoie un message d'erreur au client pour 2 cas : soit il n'y a pas de token dans la requête, soit il n'est pas valide. 
  // Pas de token dans la requête
  if(!authorizationHeader) {
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message })
  }
  else {
    // on décode le token. Si il n'est pas valide, message d'erreur. Si c'est bon, next() et middleware suivant. 
    const token = authorizationHeader.split(' ')[1] // ici on récupère la valeur du token débarassée du mot 'bearer' et de l'espace la précédant. 
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => { // la méthode .verify de jwt nous permet de vérifier si le jeton est bien valide. 
    if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error })
    }
    else {
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } else {
      next() // SI tout est bon, on laisse l'utilisateur accèder au point de terminaison qu'il a demandé, grace à la méthode next(). 
    }
  }
  })
}
}
