import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';

const UpdateUserPassword = (props:any) => {
    const [getName, setName] = useState<any>('');
    const [getUserName, setUserName] = useState<any>('');
    const [getPassword, setPassword] = useState<any>('');
    const [getConfirmPassword, setConfirmPassword] = useState<any>('');
    const [getLoading, setLoading] = useState(false);
    
    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.post("/user", {
            Name: getName,
            Username: getUserName,
            Password: getPassword, 
            ConfirmPassword: getConfirmPassword
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
            <form onSubmit={handleSubmit}>
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
            </form>
        </>
    )
}

export default UpdateUserPassword;