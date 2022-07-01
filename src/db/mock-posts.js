const postsBdd = [
    {
        id: 1,
        title: "Soirée pizza",
        content: "Salut à toutes et tous, ce soir le département communication vous invite à se retrouver au bar du Vanguard pour un petit apéro-pizzas !",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        author: {
            surname : "Jean",
            name: "Neymar"
        },
        like: 0,
        created: new Date()
       },
    {
        id: 2,
        title: "Recherche photos gratuites",
        content: "Salut à toutes et tous, pour illustrer notre nouvelle plaquette de présentation, je cherche des sites de photos gratuites. Auriez-vous quelques tuyaux à me refiler ? Je vous en remercie d'avance ! Bonne journée !",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        author: {
            surname : "Agathe",
            name: "Zeblouse"
        },
        like: 0,
        created: new Date()
    },
    {
        id: 3,
        title: "Webinaire sur les techniques de communication",
        content: "Salut les collègues ! Ce soir à 19h30 sur channel 5, il y a un webinaire de Gérard Menvuça sur les nouvelles techniques de communication. Perso j'adore ce mec, ultra compétent!  Bonne journée !",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        author: {
            surname : "Anne-Sophie",
            name: "Lantrop"
        },
        like: 0,
        created: new Date()
    }
]

module.exports = postsBdd;