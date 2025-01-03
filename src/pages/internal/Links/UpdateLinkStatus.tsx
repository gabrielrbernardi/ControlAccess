import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateLinkStatus = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getActive, setActive] = useState<any>('');
    const [getLoading, setLoading] = useState(false);
    
    useEffect(() => {
        setId(props?.id || undefined);
        setActive((props?.linkActive == true || props?.linkActive == false) ? Boolean(props?.linkActive) : undefined);
    }, [])

    const statusPossibilities = [
        {label: 'Sim', value: true},
        {label: 'Não', value: false},
    ];

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/link/status", {id: getId, Active: getActive}).then((response:any) => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Atualizado!"} message={response?.data?.data || "Atualizado com sucesso!"}/>);
        }).catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.response?.data?.error || "Erro na atualização!"}/>)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <p className="mb-2">Ativo?</p>
                <Dropdown className="col-12 mb-3" value={getActive} options={statusPossibilities} optionValue="value" onChange={(e) => setActive(e.value)} placeholder="Selecione o status" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateLinkStatus;