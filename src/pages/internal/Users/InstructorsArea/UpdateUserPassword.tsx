import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import Toast from '../../../../components/Toast';
import apiGrb from '../../../../services/apiGrb';

const UpdateUserPassword = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getOldPassword, setOldPassword] = useState<any>('');
    const [getPassword, setPassword] = useState<any>('');
    const [getConfirmPassword, setConfirmPassword] = useState<any>('');
    const [getLoading, setLoading] = useState(false);

    // useEffect(() => {
    //     setId(props?.id || undefined);
    //     console.log(props?.id)
    // },[])

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/user/password", {id: getId, OldPassword: getOldPassword, Password: getPassword, ConfirmPassword: getConfirmPassword}).then((response:any) => {
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
                    <InputText id="user" className="w-12" type="password" value={getOldPassword} onChange={(e) => {setOldPassword(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Senha antiga</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" type="password" value={getPassword} onChange={(e) => {setPassword(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nova senha</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" type="password" value={getConfirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Confirmar nova senha</label>
                </span>
                <Button type="submit" label="Redefinir" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateUserPassword;