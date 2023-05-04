'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Likes', {
            likeId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            UserId: {
                allowNull: false, // NOT NULL
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users', // Users 테이블을 참조합니다.
                    key: 'userId', // Users 테이블의 userId 컬럼을 참조합니다.
                },
                onDelete: 'CASCADE', // 만약 Users 테이블의 userId 값이 삭제되면, Comments 테이블의 데이터가 삭제됩니다.
            },
            PostId: {
                allowNull: false, // NOT NULL
                type: Sequelize.INTEGER,
                references: {
                    model: 'Posts',
                    key: 'postId',
                },
                onDelete: 'CASCADE',
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now'),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Likes');
    },
};
