// ****** ROLE : APPLIQUER LE TRAITEMENT A UNE REQUETE QUI ARRIVE SUR CE POINT DE TERMINAISON

const { Post } = require('../src/db/sequelize') // On importe dans notre fichier le modèle de post qui définit la structure de la table 'posts'
// Ensuite on exporte une fonction qui prend en paramètre l'application Express dans son entièreté. C'est ce qui nous permet de prendre en compte les routes dans app.js mais en ayant des fichiers de routes séparés et distincts. 

const {Op} = require('sequelize') // on importe les opérateurs de Sequelize pour trier les recherches de message par paramètres (titre, catégorie, ...). 

module.exports = (app) => {
  // On introduit des paramètres de requêtes au début : 
        //------- en 1 : rechercher par catégorie de message.
    app.get('/api/posts', (req, res) => {
      if (req.query.category) { //On souhaite extraire de l'url le paramètre 'category'. On passe par la requête 'req' fournie par Express. 
        const category = req.query.category
        return Post.findAll ({ 
          where: { 
            category: category
          },
          order: [
            ['created', 'DESC'] //ici on va ordonner les résultats par date de création (avec la propriété 'created') et par odre décroissant.
          ],
        }) // on a ajouté le paramètre 'where' à la méthode de Sequelize 'findAll'.
        .then(posts => {
          const message = `il y a ${posts.length} message(s) appartenant à la catégorie ${category}.`
          res.json({ message, data: posts }) 
        })
      }
        //------- en 2 : rechercher par titre large de message.
      else if (req.query.title) { //On souhaite extraire de l'url le paramètre 'title'. On passe par la requête 'req' fournie par Express. 
        const title = req.query.title
        return Post.findAll({ 
          where: { 
            title: { //'title' est la propriété du modèle post. 
              [Op.like]: `%${title}%` // 'title' est le critère de la recherche. On passe par l'opérateur Sequelize [Op.like] pour mettre en place la recherche large par titre ('titre') d'un message ou le terme de la recherche est contenu dans le titre du message.  
            }
          },
          order: [
            ['created', 'DESC'] //ici on va ordonner les résultats par date de création (avec la propriété 'created') et par odre décroissant.
          ],
        })
        .then(posts => {
          const message = `il y a ${posts.length} messages correspondant à la recherche ${title}.`
          res.json({ message, data: posts }) 
        })

      }
        // Si pas de recherche spécifique : 
      else {
        // Ensuite, si on n'applique pas de paramètres de requête, on aura la liste complète des messages. On utilise la méthode findAll() qui retourne une promesse contenant la liste de toutes les instances (messages) présentes dans la BDD.
        Post.findAll({
          order: [
            ['created', 'DESC'] //ici on va ordonner les résultats par date de création (avec la propriété 'created') et par odre décroissant.
          ],
        }) 

        .then(posts => {
          const message = 'La liste des posts a bien été récupérée.'
          res.json({ message, data: posts }) // On retourne directement notre réponse à l'intérieur de la méthode res.json()
        })
        .catch(error => {
          const message = " La liste des posts n'a pas pu être récupérée. Réessayez dans quelques instants."
          res.status(500).json({message, data: error}) // On utilise la méthode 'status()' d'Express pour définir un statut à notre réponse. La méthode prend en paramètre le code de statut http à retourner à nos clients. 
        })
    }
})
}
