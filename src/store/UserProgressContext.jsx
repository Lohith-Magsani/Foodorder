import { createContext, useState } from "react";

const UserProgressContext=createContext({
    progress:'',
    showCart:()=>{},
    hideCart:()=>{},
    showCheckout:()=>{},
    hideCheckout:()=>{}
});

export function UserProgressContextProvider({children}){
    const [userProgress,setUserprogress]=useState('');

   function showCart(){
    setUserprogress('cart');

   }
function hideCart(){
    setUserprogress('');

}

function showCheckout(){
    setUserprogress('checkout')

}

function hideCheckout(){
    setUserprogress('');

}

const UserProgressCtx={
    progress:userProgress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout
}
    return(
        <UserProgressContext.Provider value={UserProgressCtx}>{children}</UserProgressContext.Provider>
    )
}

export default UserProgressContext;