import { createContext, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthContextProvider = ({ children }: any) => {
  const [isLogin, setIsLogin] = useState({
    isLogin: false,
    isPending: true,
  });

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
