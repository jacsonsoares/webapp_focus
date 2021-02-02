// importando pacotes React, usecallback para fucoes nao se repetiren doda hora apenas quando forem chamadas
// useRef para interagir com os dados do formulario, validacoes e mensagens
import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import logoImg from '../../assets/logoNew.png';
import Button from '../../components/Button/Index';
import Input from '../../components/Input/Index';

import getValidationErrors from '../../utils/getValidationErrors';
import { Container, Background, Content } from './styles';

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const handleSubmit = useCallback(async (data: object) => {
    try {
      // limpando os erros
      formRef.current?.setErrors({});
      const lSchema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('Email obrigatório').email('Informe um e-mail válido.'),
        password: Yup.string()
          .required('Senha obrigatória')
          .min(6, 'Minimo 6 digitos'),
      });
      await lSchema.validate(data, { abortEarly: false });
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="Focus" />
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Cadastro</h1>
          <Input name="name" type="text" icon={FiUser} placeholder="Nome" />
          <Input name="email" type="email" icon={FiMail} placeholder="E-mail" />
          <Input
            name="password"
            type="password"
            icon={FiLock}
            placeholder="Senha"
          />
          <Button type="submit">Cadastrar</Button>
        </Form>
        <a href="login">
          <FiArrowLeft />
          Voltar para Login
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
