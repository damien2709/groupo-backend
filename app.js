// **** ROLE : DEMARRAGE SERVEUR NODE JS + CREATION API REST AVEC EXPRESS

// ------------ IMPORTATIONS ET VARIABLES ---------------
const express = require('express') 
const morgan = require('morgan') 
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./src/db/sequelize') 
const path = require('path');

// ------------ OPTIONS CORS POUR AUTORISER FORM MULTIPART ---------------
const corsOptions = {
    allowedHeaders:'Accept, Authorization, Content-Type, Origin',
}

// ------------ EXPRESS + SERVER -------------
const app = express()  
const port = 3000  

//--------------- MIDDLEWARES ----------------------------
app
.use(favicon(__dirname + '/favicon.ico')) 
.use(morgan('dev')) 
.use(bodyParser.json()) 
.use(cors(corsOptions)) 
.use('/images', express.static(path.join(__dirname, './images'))) 
.use('/profilPicture', express.static(path.join(__dirname, './profilPicture')))

// ------------ INITIALISATION DE LA BDD ----------------
sequelize.initDb()  

// ----------------- POINTS DE TERMINAISON ----------------
    // GET
require('./routes/getAllPosts')(app)  

require('./routes/getAllAccounts')(app)

require('./routes/getOnePost')(app) 

require('./routes/getYourAccount')(app) 

    // POST
require('./routes/createAccount')(app) 

require('./routes/login')(app) 

require('./routes/createPost')(app) 

    // UPDATE
require('./routes/updateAccount')(app) 

require('./routes/updatePost')(app) 

// DELETE
require('./routes/deleteAccount')(app) 

require('./routes/deletePost')(app) 


// --------------------- GESTION DES ERREURS ---------------------
    //404
      app.use(({res}) => {
        const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre url.'
        res.status(404).json({message}) 
        }
      )
      

// ------------------ DEMARRAGE DE L'API SUR LE PORT DEDIE ----------------
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))  

