// importando pacotes necessarios para contexto e funcoes
import React, {createContext, useCallback, useState, useContext } from 'react';
// importando dados para conexao com API
import api from '../services/api';

// interface de login
interface signInCredentials{
  email : string;
  password : string;
}

// interface para criar o contexto e o metodo de autenticacao
interface AuthContextData{
  user : object;
  signIn(credentials : signInCredentials) : Promise<void>;
  signOut() : void;
}

// interface para armazenar dados apos autenticacao
interface AuthState {
  token : string;
  user : object;
}

// criando contexto de autenficacao
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// exportando metodo de contexto e autenticacao
export const AuthProvider : React.FC = ({ children}) => {
  // validando o estado das informacoes do usuario
  // apos algum refresh ou ateracao de rota
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@focus:token');
    const user = localStorage.getItem('@focus:user');
    // se encontrou retorna dados para o estado para nao fazer login toda hora
    if (token && user){
      return {token : token, user : JSON.parse(user)};
    }
    // caso nao exista ainda ou tenha expirado retorna objeto tipado em branco
    return {} as AuthState;
  });

  // metodo de validacao de login
  const signIn = useCallback(async({ email, password}) => {
    // autenticando na API
    const response = await api.post('sessions',{email,password});
    console.log(response.data);
    // armazenando resultado da autenticacao
    const {token, user} = response.data;
    localStorage.setItem('@focus:token', token);
    localStorage.setItem('@focus:user', JSON.stringify(user));
    // armazenando estado apos altenticacao contexto
    setData({token , user});

  }, [] );

  // metodo de logout
  const signOut = useCallback(() => {
    //limpando storage
    localStorage.removeItem('@focus:user');
    localStorage.removeItem('@focus:token');
    setData({} as AuthState);
  }, []);


  return (
    //retornando contexto com as informacoes de autenticacao envolvendo o conteudo da rota
    <AuthContext.Provider value = {{user : data.user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() : AuthContextData{
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuth deve ser usado com AuthProvider!');
  }
  return context;
}
