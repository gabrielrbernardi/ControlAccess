import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';

const ResetUserPassword = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getPassword, setPassword] = useState<any>('');
    const [getConfirmPassword, setConfirmPassword] = useState<any>('');
    const [getLoading, setLoading] = useState(false);

    useEffect(() => {
        setId(props?.id || undefined);
    },[])

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/user/resetPassword", {id: getId, Password: getPassword, ConfirmPassword: getConfirmPassword}).then((response:any) => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Atualizado!"} message={response?.data?.data || "Atualizado com sucesso!"}/>);
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
                    <InputText id="user" className="w-12" type="password" value={getPassword} onChange={(e) => {setPassword(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Senha</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" type="password" value={getConfirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Confirmar senha</label>
                </span>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default ResetUserPassword;