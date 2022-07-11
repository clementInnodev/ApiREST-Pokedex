const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_keys')
  
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    console.log(req.body)
    User.findOne({ where: { username: req.body.username } })
    
    .then(user => {
        bcrypt.compare(req.body.password, user.password)
        .then(isPasswordValid => {
        if(isPasswordValid) {
            const token = jwt.sign(
                { userId: user.id },
                privateKey,
                { expiresIn: '24h' }
            )
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
        } else {
            const message = `Identifiant ou mot de passe incorrect`
            return res.status(404).json({ message })
        }
      })
    })
    .catch( error => {
        const message = 'L\'utilisateur n\'a pas pu être connecté. Réssayez dans quelques instants.'
        res.status(500).json({ message, error })
      })
  })
}