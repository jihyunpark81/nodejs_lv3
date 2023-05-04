'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            // Posts 모델에서
            this.belongsTo(models.Users, {
                // Users 모델에게 N:1 관계 설정을 합니다.
                targetKey: 'userId',
                foreignKey: 'UserId',
            });
            this.hasMany(models.Comments, {
                // Posts 모델에게 1:N 관계 설정을 합니다.
                sourceKey: 'postId',
                foreignKey: 'PostId',
            });
            this.hasMany(models.Likes, {
                // Posts 모델에게 1:N 관계 설정을 합니다.
                sourceKey: 'postId',
                foreignKey: 'PostId',
            });
        }
    }

    Posts.init(
        {
            postId: {
                allowNull: false, // NOT NULL
                autoIncrement: true, // AUTO_INCREMENT
                primaryKey: true, // Primary Key (기본키)
                type: DataTypes.INTEGER,
            },
            UserId: {
                allowNull: false, // NOT NULL
                type: DataTypes.INTEGER,
            },
            title: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
            },
            content: {
                allowNull: false, // NOT NULL
                type: DataTypes.STRING,
            },
            likes: {
                allowNull: false, // NOT NULL
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false, // NOT NULL
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false, // NOT NULL
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Posts',
        }
    );
    return Posts;
};
