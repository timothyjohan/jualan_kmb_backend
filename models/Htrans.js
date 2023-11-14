const { getDB } = require("../config/sequelize");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Htrans extends Model { }
Htrans.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nama: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        menu: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        jumlah: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        tanggal: {
            type: DataTypes.DATE,
            primaryKey: true,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Htrans",
        tableName: "htrans",
    }
),
    module.exports = Htrans