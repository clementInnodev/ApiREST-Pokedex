const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Ce nom est déjà utilisé' },
        validate: {
          notNull : { msg: 'Le nom est une propriété requise.' },
          notEmpty : { msg : 'Le nom du pokémon ne peut pas être vide' }
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt : { msg: 'Utilisez uniquement des nombres entiers pour les points de vie.' },
          notNull : { msg: 'Les points de vie sont une propriété requise.' },
          min: { args: [0], msg: 'Les points de vie doivent être supérieurs ou égales à 0.' },
          max: { args: [999], msg: 'Les points de vie doivent être inférieurs ou égales à 999.' }
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt : { msg: 'Utilisez uniquement des nombres entiers pour les points de dégâts.' },
          notNull : { msg: 'Les points de dégâts sont une propriété requise.' },
          min: { args: [0], msg: 'Les points de dégats doivent être supérieurs ou égales à 0.' },
          max: { args: [99], msg: 'Les points de dégâts doivent être inférieurs ou égales à 99.' }
        }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull : { msg: 'L\'image est une propriété requise.' },
          isUrl : { msg : 'Veuillez renseigner un lien valide pour la photo du pokémon.' }
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue('types').split(',')
        },
        set(types) {
          this.setDataValue('types', types.join())
        },
        validate: {
          isTypesValid(value){
            if(!value){
              throw new Error('Un pokémon doit au moins avoir un type.')
            }else if(value.split(',').length > 3){
              throw new Error('Un pokémon ne doit pas avoir plus de trois types.')
            }
            value.split(',').forEach(type => {
              if(!validTypes.includes(type)){
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`)
              }
            });
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }