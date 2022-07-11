const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.delete('/api/pokemons/:id', auth, (req, res) => {
        const id = req.params.id
        Pokemon.findByPk(id)
            .then( pokemon => {
                if(pokemon === null){     
                    const message = `Le pokémon n°${id} n'existe pas. Réssayez avec un autre identifiant`
                    res.status(404).json({message})
                }else{
                    return Pokemon.destroy({
                        where: { id: id }
                    })
                        .then(_ => {
                            const message = `Le pokémon ${pokemon.name} a bien été supprimé`
                            res.json({ message, data: pokemon})
                        })
                }
            })
            .catch( error => {
              const message = 'Le pokémon n\'a pas pu être supprimé. Réssayez dans quelques instants.'
              res.status(500).json({ message, error })
            })
    })
}