// **** ROLE : DEMARRAGE SERVEUR NODE JS + CREATION API REST AVEC EXPRESS

const express = require('express')  // on importe le module Express
  
const app = express()  //on crée une instance d'une application Express grâce à la méthode express. Ce sera notre petit serveur web sur lequel va fonctionner notre API REST. 
const port = 3000  //on définit une constante port : c'est le port par lequel on va passer avec notre serveur. 
  
app.get('/', (req, res) => res.send('Hello from Express!'))
  //on définit notre 1er point de terminaison (end point). On y trouve la méthode de la requête (get) qui prend 2 argument : la route par défaut de notre API, et une fonction dont le rôle est de fournir une réponse au client lorsque notre point de terminaison est appelé. Cette fonction comporte elle-même 2 arguments : req (il permet de récupérer un objet request correspondant à la requête reçue en entrée par notre point de terminaison) et res (un objet response que l'on doit renvoyer depuis Express à notre client). Ici, on utilise la méthode "send" de l'objet response afin de retourner le message "hello Express" au client. 
  
app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))  // On démarre l'API REST grace à la méthode "listen" qui prend 2 arguments : le port utilisé (3000) et une fonction : elle affiche un message de confirmation dans le terminal de commandes. 

