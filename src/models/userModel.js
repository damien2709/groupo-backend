// **** ROLE : définir un modèle d'utilisateur pour comparer les identifiants envoyés par nos utilisateurs avec les identifiants déjà stocké en base de données.

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        // on ajoute une contrainte d'unicité avec 'unique' de SEquelize, sur le nom d'utilisateur. 
        unique : { 
            msg: 'Le nom est déjà pris !'
        }
      },
      password: {
        type: DataTypes.STRING
      },
      surname: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type : DataTypes.STRING
      },
      department:{
        type: DataTypes.STRING
      },
      tel: {
        type: DataTypes.STRING
      }
    },
    // Options facultatives de paramétrage globales
  {
    timestamps: true, // en passant la valeur 'true', on indique que l'on souhaite modifier le comportement par défaut proposé par Sequelize (c’est-à-dire faire des modification de configuration globale). 
    createdAt: 'created', // on renomme la propriété 'createdAt' en 'created', ce qui nous permet de renvoyer la valeur 'created' à l'utilisateur ! 
    updatedAt: false //On peut aussi désactiver la propriété 'updatedAt' en lui passant la valeur 'false'. On refuse la sauvegarde auto proposée par Sequelize.
  })
  }
