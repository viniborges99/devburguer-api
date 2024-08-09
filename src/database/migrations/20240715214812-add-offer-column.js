module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('products');
    if (!tableInfo.offer) {
      await queryInterface.addColumn('products', 'offer', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('products');
    if (tableInfo.offer) {
      await queryInterface.removeColumn('products', 'offer');
    }
  },
};
