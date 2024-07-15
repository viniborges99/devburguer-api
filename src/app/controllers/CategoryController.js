import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    //pegando informações da nossa migrate de produtos
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = request.body; //restante das informações do formulario
    const CategoryExists = await Category.findOne({
      where: {
        name,
      },
    });
    if (CategoryExists) {
      return response.status(400).json({ error: 'Category already exists.' });
    }

    const { id } = await Category.create({
      //criando o registro no banco
      name,
    });

    return response.status(201).json({ id, name }); //retornando a informação do registro
  }
  async index(request, response) {
    const categories = await Category.findAll();
    return response.json(categories);
  }
}
export default new CategoryController();
