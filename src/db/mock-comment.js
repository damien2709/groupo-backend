const commentsBdd = [
    {
        id: 1,
        authorId: 1,
        postId: 1,
        content: "Génial le post 1 !",
        created: new Date()
       },
    {
        id: 2,
        authorId: 1,
        postId: 2,
        content: "Génial le post 2 !",
        like: 4,
        created: new Date()
    },
    {
        id: 3,
        authorId: 1,
        postId: 3,
        content: "Génial le post 3 !",
        like: 6,
        created: new Date()
    }
]

module.exports = commentsBdd;