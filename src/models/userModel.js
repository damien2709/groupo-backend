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
        },
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le nom de l'utilisateur ne peut être vide !" },
          notNull: { mes: "Veuillez définir un nom d'utilisateur" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le mot de passe ne peut être vide !" },
          notNull: { mes: "Veuillez définir un mot de passe" },
          // On définit une regex pour le mot de passe et un message d'erreur
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
            msg: "Le mot de passe doit contenir au moins 8 caractères avec au moins 1 majuscule, 1 minuscule et un caractère spécial."
          }
        }
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le prénom ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre prénom" }
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le prénom ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre nom" }
        }
      },
      email: {
        type : DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 3 validateurs pour vérifier que le nom ne comporte pas une string vide, que la valeur de la propriété ne peut pas être nulle et qu'il s'agit bien d'un email. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "L'email ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre email" },
          isEmail: {msg: "Veuillez rentrer un email correct"}
          // on utilise la validateur d'email de Sequelize

        }
      },
      department:{
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le service ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre service dans l'entreprise" }
        }
      },
      tel: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // On définit pour la propriété 2 validateurs pour vérifier que le nom ne comporte pas une string vide et que la valeur de la propriété ne peut pas être nulle. On définit un message spécifique pour chaque validateur !
        validate : {
          notEmpty: { msg: "Le numéro de téléphone ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner le numéro de téléphone de votre poste" }
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isLogged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

    },
    // Options facultatives de paramétrage globales
  {
    timestamps: true, // en passant la valeur 'true', on indique que l'on souhaite modifier le comportement par défaut proposé par Sequelize (c’est-à-dire faire des modification de configuration globale). 
    createdAt: 'created', // on renomme la propriété 'createdAt' en 'created', ce qui nous permet de renvoyer la valeur 'created' à l'utilisateur ! 
    updatedAt: false //On peut aussi désactiver la propriété 'updatedAt' en lui passant la valeur 'false'. On refuse la sauvegarde auto proposée par Sequelize.
  })
  }
