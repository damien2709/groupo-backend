const postsBdd = [
    {
        id: 1,
        authorId: 1,
        title: "Soirée pizza",
        content: "Salut à toutes et tous, ce soir le département communication vous invite à se retrouver au bar du Vanguard pour un petit apéro-pizzas !",
        category: "Fun",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        like: 2,
        created: new Date()
       },
    {
        id: 2,
        authorId: 1,
        title: "Recherche photos gratuites",
        content: "Salut à toutes et tous, pour illustrer notre nouvelle plaquette de présentation, je cherche des sites de photos gratuites. Auriez-vous quelques tuyaux à me refiler ? Je vous en remercie d'avance ! Bonne journée !",
        category: "Entraide",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        created: new Date()
    },
    {
        id: 3,
        authorId: 1,
        title: "Webinaire sur les techniques de communication",
        content: "Salut les collègues ! Ce soir à 19h30 sur channel 5, il y a un webinaire de Gérard Menvuça sur les nouvelles techniques de communication. Perso j'adore ce mec, ultra compétent!  Bonne journée !",
        category: "Infos",
        picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
        created: new Date()
    }
]

module.exports = postsBdd;