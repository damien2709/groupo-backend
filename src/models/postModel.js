// **** ROLE : PERMET DE DEFINIR LA STRUCTURE DE LA TABLE 'POST' DE NOTRE BDD. PERMET D'APPLIQUER DES TRAITEMENTS AUX DONNEES POUR LES CONVERTIR ET LES RENDRE UTILISABLES ENTRE BDD ET API

// Je définis une constante qui comprendra la liste des choix possibles de la propriété 'category' d'un message
const validCategory = ['Fun', 'Entraide', 'Infos', 'Projet' ]

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
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      authorSurname: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // Pas de contrainte d'unicité !
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: false, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // Pas de contrainte d'unicité !
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true, // Permet d'indiquer si la propriété est facultative ou non. Ici, elle est obligatoire !
        // Pas de contrainte d'unicité !
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        // Pas de contrainte d'unicité !
        validate : {
          notEmpty: { msg: "Le contenu de votre message ne peut être vide !" },
          notNull: { mes: 'Veuillez écrire du contenu dans votre message' }
        }
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        // Ici, on va créer un validateur personnalisé 'isCategoryValid' (c'est une fonction personnalisée) pour vérifier que la propriété 'category' comprend bien 1 valeur et une seule et que la valeur de la propriété appartient bien à une liste prédéfinie. le paramètre 'value' de la fonction correspond à la valeur brute (string) de la propriété 'category' en base de données sans prendre en compte le getter ou le setter de la propriété. On devra donc appliquer parfois la méthode split().
        validate : {
          isCategoryValid(value) {
            // Sur la string que je récupère, je vérifie qu'il existe au moins une valeur pour la propriété
            if(!value) {
              throw new Error("Merci d'ajouter une catégorie à votre message !") // on renvoie l'erreur, Sequelize est capable d'interceper et de retourner cette erreur au client car nous sommes dans le cas d'un validateur personnalisé.
            }
            // Je transforme ensuite cette chaine en tableau avec 'split' (Car la BDD me renvoie une string) et je vérifie que sa longueur n'est pas supérieur à 1 !
            if(value.split(',').length > 1) {
              throw new Error("Un message ne peut comporter qu'une seule catégorie !")
            }
            // Enfin, on va restreindre le choix de la catégorie à définir d'un message grace à une liste de choix prédéfinie dans notre constante déclarée plus haut : (constant : 'validCategory').  Je transforme la chaine en tableau avec 'split' (Car la BDD me renvoie une string) et je parcours la catégorie du message pour vérifier si elle est bien inclus dans la liste ou non !
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
        allowNull: true, // la propriété est facultative
        // Pas de contrainte d'unicité !
        validate : {
          isUrl: { msg: "Utilisez uniquement une url valide"},
        }
      },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
  