const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth')
  
module.exports = (app) => {
  app.get('/api/pokemons/:id', auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then(pokemon => {
        if(pokemon === null){
          const message = `Le pokémon n°${req.params.id} n'existe pas. Réssayez avec un autre identifiant`
          res.status(404).json({ message })
        }else{
          const message = 'Un pokémon a bien été trouvé.'
          res.json({ message, data: pokemon })
        }
      })
      .catch( error => {
        const message = 'Le pokémon n\'a pas pu être récupéré. Réssayez dans quelques instants.'
        res.status(500).json({ message, error })
      })
  })
}