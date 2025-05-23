import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiZen from '../../../services/apiZen';

const UpdateUserStatus = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getActive, setActive] = useState<any>();
    const [getLoading, setLoading] = useState(false);

    const statusPossibilities = [
        {label: 'Ativo', value: true},
        {label: 'Não Ativo', value: false},
    ];

    useEffect(() => {
        setActive(props?.status === true || props?.status === false ? Boolean(props?.status) : undefined);
        setId(props?.id || undefined);
    },[])

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiZen.put("/user/status", {id: getId, Active: getActive}).then((response:any) => {
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
                <p className="my-2">Status</p>
                <Dropdown className="col-12 mb-3" value={getActive} options={statusPossibilities} onChange={(e) => setActive(e.value)} placeholder="Selecione o status" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateUserStatus;