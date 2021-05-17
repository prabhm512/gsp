module.exports = (sequelize, DataTypes) => {
    const Edge = sequelize.define("Edge", {
        start_id: {
            type: DataTypes.INTEGER
        },
        end_id: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false
    });

    return Edge;
};