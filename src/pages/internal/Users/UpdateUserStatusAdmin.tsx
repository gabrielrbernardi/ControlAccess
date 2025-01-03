import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';

const UpdateUserStatusAdmin = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getActive, setActive] = useState<any>();
    const [getLoading, setLoading] = useState(false);

    const statusPossibilities = [
        {label: 'Administrador', value: true},
        {label: 'Padrão', value: false},
    ];

    useEffect(() => {
        setActive(props?.statusAdmin === true || props?.statusAdmin === false ? Boolean(props?.statusAdmin) : undefined);
        setId(props?.id || undefined);
    },[])

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/user/changeUserType", {id: getId, Admin: getActive}).then((response:any) => {
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

export default UpdateUserStatusAdmin;