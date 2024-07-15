import { response } from 'express';
import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class SessionControler {
  async store(request, response) {
    const schema = Yup.object({
      //criando o schema para verificar as informações
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body); //

    const emailOrPasswordIncorrect = () => {
      // msg de erro
      response
        .status(401)
        .json({ error: 'Make sure your email or password are correct' });
    };

    if (!isValid) {
      //se não for valido, para o fluxo com o return e aparece a msg de erro
      return emailOrPasswordIncorrect();
    }

    const { email, password } = request.body; //recebendo o email e a senha

    const user = await User.findOne({
      //recuperar os dados do usuario para saber se o usuario existe
      where: { email },
    });
    if (!user) {
      return emailOrPasswordIncorrect();
    }

    const isSamePassword = await user.checkPassword(password); //a verificação esta no user e aqui estamos chamando ela

    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn, // informções do token
      }),
    });
  }
}

export default new SessionControler();
