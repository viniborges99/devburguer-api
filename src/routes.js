import { Router, response } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import Prodructcontroller from './app/controllers/productController';
import multer from 'multer';
import multerConfig from './config/multer';
import productController from './app/controllers/productController';
import authMiddeleware from './app/middlewares/auth';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddeleware);

routes.post('/products', upload.single('file'), Prodructcontroller.store);
routes.get('/products', productController.index); //rota para listar os produtos, e quando lista recupera a url mencionada no product do model
routes.put('/products/:id', upload.single('file'), Prodructcontroller.update);

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
export default routes;
