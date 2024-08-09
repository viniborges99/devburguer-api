import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { name } = request.body;

    let path; // Inicialize path como undefined
    if (request.file) {
      path = request.file.filename; // Apenas atribua o filename se request.file existir
    }

    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const { id } = await Category.create({ name, path });

    return response.json({ name, id });
  }

  async index(request, response) {
    const categories = await Category.findAll();

    return response.json(categories);
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;

    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
      return response
        .status(401)
        .json({ error: 'Make sure your category id is correct' });
    }
    let path; // Inicialize path como undefined
    if (request.file) {
      path = request.file.filename; // Apenas atribua o filename se request.file existir
    }

    const { name } = request.body;

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: { name },
      });

      if (categoryNameExists && categoryNameExists.id !== +id) {
        return response.status(400).json({ error: 'Category already exists' });
      }
    }

    await Category.update(
      {
        name,
        path,
      },
      {
        where: {
          id,
        },
      },
    );

    return response.status(200).json();
  }
}

export default new CategoryController();
