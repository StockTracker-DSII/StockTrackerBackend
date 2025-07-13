'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');              // ← instala con: npm i bcrypt

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    // Método de instancia para comparar contraseñas en login
    async checkPassword(plainPwd) {
      return bcrypt.compare(plainPwd, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
      },
      password: DataTypes.STRING,          // aquí SOLO se guarda el hash
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      hooks: {
        /**
         * Antes de crear un registro
         */
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        /**
         * Antes de actualizar (p. ej. cambio de contraseña)
         */
        beforeUpdate: async (user) => {
          // Solo hashear si la contraseña cambió
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
