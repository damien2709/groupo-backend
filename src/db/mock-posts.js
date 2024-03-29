const postsBdd = [
    {
        id: 1,
        title: "Soirée pizza",
        content: 'Salut à toutes et tous, ce soir le département communication vous invite à se retrouver au bar du "Coco Beach" pour un petit apéro-pizzas !',
        category: "Fun",
        picture: "http://localhost:3000/images/restaurant-1.jpeg",
        created: new Date()
       },
    {
        id: 2,
        title: "Recherche photos gratuites en urgence !",
        content: "Salut à toutes et tous, pour illustrer notre nouvelle plaquette de présentation, je cherche des sites de photos gratuites en urgence. Auriez-vous quelques tuyaux à me refiler ? Je vous en remercie d'avance ! Bonne journée !",
        category: "Entraide",
        picture: "http://localhost:3000/images/emergency.jpg",
        created: new Date()
    },
    {
        id: 3,
        title: "Webinaire sur les techniques de communication",
        content: "Salut les collègues ! Ce soir à 19h30 sur channel 5, il y a un webinaire de Gérard Menvuça sur les nouvelles techniques de communication. Perso j'adore ce mec, ultra compétent!  Bonne journée !",
        category: "Infos",
        picture: "http://localhost:3000/images/cow-boy.jpg",
        created: new Date()
    }
]

module.exports = postsBdd;