import * as Yup from 'yup';
import Product from '../models/Products';
import Category from '../models/Category';
import User from '../models/User';
class ProductController {
  async store(request, response) {
    //pegando informações da nossa migrate de produtos
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
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

    const { filename: path } = request.file; //recuperando a informação do file
    const { name, price, category_id, offer } = request.body; //restante das informações do formulario
    const product = await Product.create({
      //criando o registro no banco
      name,
      price,
      category_id,
      path,
      offer,
    });

    return response.status(201).json(product); //retornando a informação do registro
  }

  async update(request, response) {
    //pegando informações da nossa migrate de produtos
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
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

    const { id } = request.params;
    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(400).json({ error: 'Product not found' });
    }
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name, price, category_id, offer } = request.body;
    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      {
        where: {
          id,
        },
      },
    );

    return response.status(200).json(); //retornando a informação do registro
  }
  async index(request, response) {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    return response.json(products);
  }
}
export default new ProductController();
