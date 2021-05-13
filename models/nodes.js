module.exports = (sequelize, DataTypes) => {
    const Node = sequelize.define("Node", {
        node_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        url: {
            type: DataTypes.STRING
        }
    });
    return Node;
};