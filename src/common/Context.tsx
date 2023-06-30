import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { getAccessToken } from './storage';

export const LoginContext = createContext({
  isLogin: false,
  setLogin: (value:boolean)=>{}
})

export const LoginProvider = ({children}: {children:ReactNode}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const setLogin = (value:boolean) => {
    setIsLogin(value);
  }
  const checkLogin = async () => {
    const token = await getAccessToken();
    if(token) setIsLogin(true);
  }
  useEffect(()=>{ 
    checkLogin();
  },[])

  return (
    <LoginContext.Provider value={{isLogin, setLogin}}>
      {children}
    </LoginContext.Provider>
  )
}