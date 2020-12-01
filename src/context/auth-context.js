import React ,{useState}from 'react';


//init context object..sharing state
export const AuthContext = React.createContext({
    isAuth:false,
    login:()=>{}//component内でuseStateを使って再定義するのでプレースホルダーをここでは定義
});

const AuthContextProvider = props =>{
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const loginHandler = () =>{
        setIsAuthenticated(true);
    };
    return (
        //valueにセットすることでContext.Consumerでcontext objectをどこからでも取り出すことができる
        //AuthContext.Providerでラップされたすべてのcomponentはupdated Valueをlisteningする
        <AuthContext.Provider value={{login:loginHandler,isAuth:isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;