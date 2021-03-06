import React, { useEffect } from 'react';
import { Container } from './styles';
import { FiAlertCircle, FiXCircle, FiCheckCircle, FiInfo} from 'react-icons/fi';
import { ToastMessage , useToast } from '../../../hooks/toast';
interface ToastProps{
  message : ToastMessage;
}

const icons = {
  info : <FiInfo size={24} />,
  error : <FiAlertCircle size={24} />,
  success : <FiCheckCircle size={24} />,
}

const Toast : React.FC<ToastProps> = ({message}) => {
  //acao do componente
  const { removeToast }  = useToast();

  //metod de controle de estado
  useEffect(() =>{
    //fechar depois de 3 segundos
    const timer = setTimeout(() =>  removeToast(message.id), 3000);
  },[removeToast, message.id]);

  return (
    <Container type={message.type} hasDescription={!!message.description} >
        {icons[message.type || 'info']}
        <div>
          <strong>{message.title}</strong>
          {message.description && <p>{message.description}</p>}
        </div>
        <button type="button" onClick={() => removeToast(message.id)}>
          <FiXCircle size={18}/>
        </button>
    </Container>
  );
}

export default Toast;
