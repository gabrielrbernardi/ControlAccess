import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import apiZen from '../services/apiZen';

const Login = () => {
    const navigate = useNavigate();
    const [getUser, setUser] = useState<string>();
    const [getPass, setPass] = useState<string>();

    const [getMessageError, setMessageError] = useState<string>();

    const [getLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth(){
        if(getCookie("isAuth") === 'true'){
            navigate("/internal")
            return true;
        }else{
            return false;
        }
      }
    
    function getCookie(name:any) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';')?.shift();
    }

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true)
        await apiZen.post("/users/login", {username: getUser, password: getPass}).then(async response => {
            const d = new Date();
            // d.setTime(d.getTime() + (10*1000));
            d.setTime(d.getTime() + (4*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = "isAuth=true; path=/;" + expires + "Secure";
            setTimeout(() => {
                if(response?.data?.data?.Admin){
                    document.cookie = `isAdmin=true; path=/; Secure`;
                }else{
                    document.cookie = `isAdmin=false; path=/; Secure`;
                }
                if(response?.data?.data?.id){
                    document.cookie = `id=${response?.data?.data?.id}; path=/; Secure`
                    apiZen.defaults.headers.common['id_usuario'] = response?.data?.data?.id;
                }
                document.cookie = `name=${response?.data?.username}; path=/; Secure`
                document.cookie = `token=${response?.data?.token}; path=/; Secure`
                setLoading(false);
                navigate("/internal")
            }, 2000);
            // return
        }).catch((err) =>{
            setLoading(false)
            setMessageError(err?.response?.data?.error || "Erro no Login!")
        })
    }

    return (
        <div className="flex grid align-content-center login">
            <form className="bg-white-alpha-70 text-black-alpha-50 text-center p-4 border-round shadow-8 mx-auto my-auto lg:col-4 md:col-6 col-12" onSubmit={handleSubmit}>
                <h2 className="text-left mb-5">Login</h2>
                {getMessageError
                    ? 
                        <div className="col-12 mb-4">
                            <Message className="col-12" severity="error" text={getMessageError} />
                        </div>
                    : <></>
                }
                <span className="p-float-label mb-4">
                    <InputText id="user" className="w-12" value={getUser} onChange={(e) => {setUser(e.target.value)}} autoFocus disabled={getLoading} autoComplete="hidden"/>
                    <label htmlFor="user">Usuário</label>
                </span>

                <span className="p-float-label">
                    <InputText id="user" className="w-12" type={'password'} value={getPass} onChange={(e) => {setPass(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="pass">Senha</label>
                </span>
                <br/>
                <Button loading={getLoading} className="p-button-sm" type="submit" label={!getLoading ? "Login" : "Carregando"}/>
                <Button className="p-button-sm ml-auto text-right" type="button" onClick={() => navigate("/signup")} link label="Criar usuário"/>
            </form>
        </div>
    )
}

export default Login;