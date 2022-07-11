const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
let pokemons = require('./mock-pokemon')


const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-2'
    },
    logging: false
})

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({force: true})
        .then( () => {
            console.log('INIT DB')

            pokemons.map( pokemon => {
                Pokemon.create({
                    name: pokemon.name,
                    hp: pokemon.hp,
                    cp: pokemon.cp,
                    picture: pokemon.picture,
                    types: pokemon.types
                }).then(pokemons => console.log(pokemons.toJSON()))
            })

            bcrypt.hash('azerty', 10)
            .then( hash => User.create({username: 'Clément', password: hash}))
            .then( user => console.log(user.toJSON()))

            bcrypt.hash('test', 10)
            .then( hash => User.create({username: 'test', password: hash}))
            .then( user => console.log(user.toJSON()))

            console.log('La base de données "Pokedex" a bien été synchronisée.')
        })
}

module.exports = {
    initDb, Pokemon, User
}