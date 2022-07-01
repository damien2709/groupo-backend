const { Post } = require('../src/db/sequelize') // On importe dans notre fichier le modèle de post qui définit la structure de la table 'pokemons'
// Ensuite on exporte une fonction qui prend en paramètre l'application Express dans son entièreté. C'est ce qui nous permet de prendre en compte les routes dans app.js mais en ayant des fichiers de routes séparés et distincts. 
module.exports = (app) => {
    app.get('/api/posts', (req, res) => {
      Post.findAll() // On utilise la méthode findAll() qui retourne une promesse contenant la liste de toutes les instances (pokemons) présentes dans la BDD.
        .then(posts => {
          const message = 'La liste des posts a bien été récupérée.'
          res.json({ message, data: posts }) // On retourne directement notre réponse à l'intérieur de la méthode res.json()
        })
    })
}
