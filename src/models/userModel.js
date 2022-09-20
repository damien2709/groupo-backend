// **** ROLE : définir un modèle d'utilisateur pour comparer les identifiants envoyés par nos utilisateurs avec les identifiants déjà stocké en base de données.

module.exports = (sequelize, DataTypes) => {
    
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type : DataTypes.STRING,
        allowNull: false, 
        unique : { 
          msg: "L'email existe déjà dans la base de données !"
        },
        validate : {
          notEmpty: { msg: "L'email ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre email" },
          isEmail: {msg: "Veuillez rentrer un email correct"}
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate : {
          notEmpty: { msg: "Le mot de passe ne peut être vide !" },
          notNull: { mes: "Veuillez définir un mot de passe" },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/,
            msg: "Le mot de passe doit contenir au moins 8 caractères avec au moins 1 majuscule, 1 minuscule et un caractère spécial."
          }
        }
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate : {
          notEmpty: { msg: "Le prénom ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre prénom" }
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, 
        validate : {
          notEmpty: { msg: "Le prénom ne peut être vide !" },
          notNull: { mes: "Veuillez renseigner votre nom" }
        }
      },
      department:{
        type: DataTypes.STRING,
      },
      tel: {
        type: DataTypes.STRING,
      },
      picture: {
        type : DataTypes.STRING,
        defaultValue: 'http://localhost:3000/profilPicture/unknownUser.jpg',
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    // Options facultatives de paramétrage globales
  {
    timestamps: true, 
    createdAt: 'created', 
    updatedAt: false 
  });


  return User;
  }
