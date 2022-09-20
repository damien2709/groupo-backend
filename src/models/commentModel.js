// **** ROLE : PERMET DE DEFINIR LA STRUCTURE DE LA TABLE 'comment' DE NOTRE BDD. PERMET D'APPLIQUER DES TRAITEMENTS AUX DONNEES POUR LES CONVERTIR ET LES RENDRE UTILISABLES ENTRE BDD ET API


module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Comment', {
  // Description du modèle (propriétés)
      id: {
        type: DataTypes.INTEGER, /
        primaryKey: true, 
        autoIncrement: true 
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,

        validate : {
          notEmpty: { msg: "Le contenu de votre message ne peut être vide !" },
          notNull: { mes: 'Veuillez écrire du contenu dans votre message' }
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true, 
        validate : {
          isUrl: { msg: "Utilisez uniquement une url valide"},
        }
      },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    },

  // Options facultatives de paramétrage globales
  {
      timestamps: true, 
      createdAt: 'created', 
      updatedAt: false 
    })
  }
  