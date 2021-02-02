import React, { useCallback, useRef} from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import logoImg from '../../assets/logoNew.png';
import Button from '../../components/Button/Index';
import Input from '../../components/Input/Index';
import {useAuth} from '../../hooks/auth';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Background, Content } from './styles';
import { useToast } from '../../hooks/toast';

interface SignInFormData{
  email : string;
  password : string;
}

const SignIn: React.FC = () => {
  // objeto de controle do formulario
  const formRef = useRef<FormHandles>(null);
  // pegando contextos de autenticacao atuais, caso tenha espirado ou ainda nao atenticado retorna objeto em branco
  const {signIn} = useAuth();
  // instanciando contenxto de mensagens toast
  const {addToast} = useToast();

  // metodo que valida e chama autenticao do usuario
  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      // limpando os erros
      formRef.current?.setErrors({});
      // validando formulario
      const lSchema = Yup.object().shape({
        email: Yup.string().required('Email obrigatório').email('Informe um e-mail válido.'),
        password: Yup.string().required('Senha obrigatória'),
      });
      await lSchema.validate(data, { abortEarly: false });

      // Autenticando usuario
      await signIn({email : data.email, password : data.password});

    } catch (err) {
      // validando excessoes do formulario
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        // exibindo excessoes no formulario
        formRef.current?.setErrors(errors);
      }
      addToast({
        type : 'error',
        title : 'Erro na Autenticação',
        description : 'Erro ao fazer login, valide as credenciais',
      });

    }
  }, [signIn, addToast]);

  return (
    // form de login
    <Container>
      <Content>
        <img src={logoImg} alt="Focus" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu login</h1>
          <Input name="email" type="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            type="password"
            icon={FiLock}
            placeholder="Senha"
          />
          <Button type="submit">Entrar</Button>
          <a href="forgot">esqueci minha senha</a>
        </Form>
        <a href="login">
          <FiLogIn />
          Criar Conta
        </a>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
