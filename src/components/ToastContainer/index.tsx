import React from 'react';
import { useTransition } from 'react-spring';
import { Container } from './styles';
import {ToastMessage } from '../../hooks/toast'
import Toast from './Toast';

interface ToastContainerProps{
  messages: ToastMessage[];
}

const ToastContainer : React.FC<ToastContainerProps> = ( { messages }) => {
  const transitions = useTransition(
    messages,
    (message) => message.id,
    {
      from: { rigth: '-120%' },
      enter: { rigth: '0%' },
      leave: { rigth: '-120%' },
    },
  );

  return (
    <Container>
      {transitions.map(({item, key, props})  =>(
        <Toast key={key} message={item} ></Toast>
      ))}
    </Container>
  );
};

export default ToastContainer;
