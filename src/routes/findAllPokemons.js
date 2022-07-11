const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        if(req.query.name){
            const name = req.query.name 
            if(name.length < 2){
                const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
                return res.json({ message })
            }
            const limit = parseInt(req.query.limit) || 5
            Pokemon.findAndCountAll({
                where: { 
                   name: 
                   {[Op.like]: `%${name}%` }
               },
               limit: limit,
               order: ['name']
            }).then(({count, rows}) => {
                if(count > 1){
                    const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name} et ${limit} pokémons sont affichés par page`
                    return res.json({ message, data: rows})
                }else if(count === 1){
                    const message = `Il y a un pokémon qui correspond au terme de recherche ${name}`
                    return res.json({ message, data: rows})
                }else{
                    const message = `Il n'existe aucun pokémon portant le nom ${name}`
                    return res.status(400).json({ message })
                }
            })
            .catch( error => {
                const message = 'La liste des pokémons n\' a pas pu être récupérée. Réssayez dans quelques instants'
                res.status('500').json( { message, error } )
            })
        } else {
            const limit = req.query.limit ? parseInt(req.query.limit) : null
            Pokemon.findAndCountAll({
                limit: limit,
                order: ['name']
            }).then( ({ count, rows }) => {
                const message = `La liste complète des ${count} pokémons a été récupérée et ${limit} pokémons sont affichés par page.`
                res.json({ message, data: rows})
            })
            .catch( error => {
                const message = 'La liste des pokémons n\' a pas pu être récupérée. Réssayez dans quelques instants'
                res.status('500').json( { message, error } )
            })
        }
    }
)}