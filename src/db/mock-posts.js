const postsBdd = [
    {
        id: 1,
        authorId: 1,
        authorSurname: "Damien",
        authorName: "Will",
        title: "Soirée pizza",
        content: 'Salut à toutes et tous, ce soir le département communication vous invite à se retrouver au bar du "Coco Beach" pour un petit apéro-pizzas !',
        category: "Fun",
        picture: "http://localhost:3000/images/beach1.jpg",
        created: new Date()
       },
    {
        id: 2,
        authorId: 1,
        authorSurname: "Damien",
        authorName: "Will",
        title: "Recherche photos gratuites en urgence !",
        content: "Salut à toutes et tous, pour illustrer notre nouvelle plaquette de présentation, je cherche des sites de photos gratuites en urgence. Auriez-vous quelques tuyaux à me refiler ? Je vous en remercie d'avance ! Bonne journée !",
        category: "Entraide",
        picture: "http://localhost:3000/images/AdobeStock_126101942-light.jpg",
        created: new Date()
    },
    {
        id: 3,
        authorId: 1,
        authorSurname: "Damien",
        authorName: "Will",
        title: "Webinaire sur les techniques de communication",
        content: "Salut les collègues ! Ce soir à 19h30 sur channel 5, il y a un webinaire de Gérard Menvuça sur les nouvelles techniques de communication. Perso j'adore ce mec, ultra compétent!  Bonne journée !",
        category: "Infos",
        picture: "http://localhost:3000/images/e-marketing Ingdev 1.jpg",
        created: new Date()
    }
]

module.exports = postsBdd;