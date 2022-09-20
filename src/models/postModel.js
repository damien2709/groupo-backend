// **** ROLE : PERMET DE DEFINIR LA STRUCTURE DE LA TABLE 'POST' DE NOTRE BDD. PERMET D'APPLIQUER DES TRAITEMENTS AUX DONNEES POUR LES CONVERTIR ET LES RENDRE UTILISABLES ENTRE BDD ET API

const validCategory = ['Fun', 'Entraide', 'Infos', 'Projet' ]

module.exports = (sequelize, DataTypes) => {

    const Post = sequelize.define('Post', {
  // Description du modèle (propriétés)
      id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
          notEmpty: { msg: "Le contenu de votre message ne peut être vide !" },
          notNull: { mes: 'Veuillez écrire du contenu dans votre message' }
        }
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
          isCategoryValid(value) {
            if(!value) {
              throw new Error("Merci d'ajouter une catégorie à votre message !") 
            }
            if(value.split(',').length > 1) {
              throw new Error("Un message ne peut comporter qu'une seule catégorie !")
            }
            value.split(',').forEach(category => {
              if(!validCategory.includes(category)) {
                throw new Error(`La catégorie du message doit appartenir à la liste des catégories : ${validCategory}`) // Si la catégorie n'est pas correcte, on retourne une erreur.
              } 
            })
          }
        }
      }, 
      picture: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      nbLike: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      iLike: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      usersLike: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
    },

  {
      timestamps: true, 
      createdAt: 'created', 
      updatedAt: false 
    }); 

    return Post;
  }



  