// **** ROLE : PERMET DE DEFINIR LA STRUCTURE DE LA TABLE 'POST' DE NOTRE BDD. PERMET D'APPLIQUER DES TRAITEMENTS AUX DONNEES POUR LES CONVERTIR ET LES RENDRE UTILISABLES ENTRE BDD ET API

//on exporte une fonction qui prend 2 paramètres : 'sequelize' (l'objet représente la connexion à notre BDD) et 'DataTypes' qui permet de définir les types de données de chaque propriété de notre modèle.
module.exports = (sequelize, DataTypes) => {
    // On va ensuite, grace à la méthode .define de l'objet paramètre, déclarer la création d'une table dans la BDD sequelize. Cette méthode prend 3 paramètres : le nom du modèle (donc de la table), la description de notre modèle avec ses différentes propriétés, des options facultatives de paramétrages globales. On 'return' le résultat de la méthode, car cette dernière retourne directement le nouveau modèle déclaré. On pourra donc utiliser ce modèle ailleurs dans notre API REST grace à l'exportation de module que l'on fait à la ligne 1. 
    return sequelize.define('Post', {
  // Description du modèle (propriétés)
      id: {
        type: DataTypes.INTEGER, // On retrouve le type de la propriété
        primaryKey: true, // indique quelle propriété est la clé primaire
        autoIncrement: true //Indique si la valeur se définit automatiquement en +1
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },

    // ATTENTION avec les propriétés qui seraient des tableaux ou des objets, comme la BDD ne gère que des strings, il faudra implémenter à la propriété un GETTER et un SETTER. 

  // Options facultatives de paramétrage globales
  {
      timestamps: true, // en passant la valeur 'true', on indique que l'on souhaite modifier le comportement par défaut proposé par Sequelize (c’est-à-dire faire des modification de configuration globale). 
      createdAt: 'created', // on renomme la propriété 'createdAt' en 'created', ce qui nous permet de renvoyer la valeur 'created' à l'utilisateur ! 
      updatedAt: false //On peut aussi désactiver la propriété 'updatedAt' en lui passant la valeur 'false'. On refuse la sauvegarde auto proposée par Sequelize.
    })
  }
  