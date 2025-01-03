import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateScoreboardStatus = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getActive, setActive] = useState<any>('');
    const [getLoading, setLoading] = useState(false);
    
    useEffect(() => {
        setActive((props?.levelActive == true || props?.levelActive == false) ? Boolean(props?.levelActive) : undefined);
        setId(props?.id || undefined);
    }, [])

    const statusPossibilities = [
        {label: 'Sim', value: true},
        {label: 'Finalizado', value: false},
    ];

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/scoreboard/status", {id: getId, Active: getActive}).then((response:any) => {
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
                <p className="mb-2">Acontecendo Agora?</p>
                <Dropdown className="col-12 mb-3" value={getActive} options={statusPossibilities} onChange={(e) => setActive(e.value)} placeholder="Selecione o status" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateScoreboardStatus;