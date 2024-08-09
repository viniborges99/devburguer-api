import Sequelize, { Model } from 'sequelize';

class Category extends Model {
  // criando a model de category
  static init(sequelize) {
    super.init(
      //essas são as propriedades que ela tem
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3001/category-file/${this.path}`;
          },
        },
      },

      {
        sequelize,
      },
    );
    return this;
  }
}

export default Category;
