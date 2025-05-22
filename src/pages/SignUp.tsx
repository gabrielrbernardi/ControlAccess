import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';
import Toast from '../components/Toast';
import apiZen from '../services/apiZen';
import { useNavigate } from 'react-router-dom';

const UpdateUserPassword = (props:any) => {
    const navigate = useNavigate();

    const [getName, setName] = useState<any>('');
    const [getUserName, setUserName] = useState<any>('');
    const [getPassword, setPassword] = useState<any>('');
    const [getConfirmPassword, setConfirmPassword] = useState<any>('');
    const [getLoading, setLoading] = useState(false);
    
    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiZen.post("/users", {
            username: getUserName,
            password: getPassword, 
            confirmPassword: getConfirmPassword
        }).then((response:any) => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Criado!"} message={response?.data?.data || "Criado com sucesso!"}/>);
        }).catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.response?.data?.error || "Erro na atualização!"}/>);
        })
    }

    return (
        <>
            <div className="flex grid align-content-center login">
                <form className="bg-white-alpha-70 text-black-alpha-50 text-center p-4 border-round shadow-8 mx-auto my-auto lg:col-4 md:col-6 col-12" onSubmit={handleSubmit}>
                    <h2 className="text-left mb-5">Criar Usuário</h2>
                    <span className="p-float-label mb-4 mt-4">
                        <InputText id="user" className="w-12" value={getName} onChange={(e) => {setName(e.target.value)}} disabled={getLoading}/>
                        <label htmlFor="user">Nome</label>
                    </span>
                    <span className="p-float-label mb-4 mt-4">
                        <InputText id="user" className="w-12" value={getUserName} onChange={(e) => {setUserName(e.target.value)}} disabled={getLoading}/>
                        <label htmlFor="user">Usuário</label>
                    </span>
                    <span className="p-float-label mb-4 mt-4">
                        <InputText id="user" className="w-12" type="password" value={getPassword} onChange={(e) => {setPassword(e.target.value)}} disabled={getLoading}/>
                        <label htmlFor="user">Senha</label>
                    </span>
                    <span className="p-float-label mb-4 mt-4">
                        <InputText id="user" className="w-12" type="password" value={getConfirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} disabled={getLoading}/>
                        <label htmlFor="user">Confirmar senha</label>
                    </span>
                    <Button type="submit" label="Criar" loading={getLoading}/>
                    <Button className="p-button-sm ml-auto text-right" type="button" onClick={() => navigate("/login")} link label="Login"/>
                </form>
            </div>
        </>
    )
}

export default UpdateUserPassword;