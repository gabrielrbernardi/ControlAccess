import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateLevel = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getName, setName] = useState<any>('');
    const [getValue, setValue] = useState<any>('');
    const [getActive, setActive] = useState<any>('');
    const [getLoading, setLoading] = useState(false);
    
    useEffect(() => {
        setName(props?.levelName || undefined);
        setValue(props?.levelValue || undefined);
        setActive((props?.levelActive == true || props?.levelActive == false) ? Boolean(props?.levelActive) : undefined);
        setId(props?.id || undefined);
    }, [])

    const statusPossibilities = [
        {label: 'Sim', value: true},
        {label: 'Não', value: false},
    ];

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/level", {id: getId, Name: getName, Value: getValue, Active: getActive}).then((response:any) => {
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
                    <InputText id="user" className="w-12" value={getName} onChange={(e) => {setName(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome</label>
                </span>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="user" className="w-12" value={getValue} onChange={(e) => {setValue(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Valor</label>
                </span>
                <p className="mb-2">Ativo?</p>
                <Dropdown className="col-12 mb-3" value={getActive} options={statusPossibilities} onChange={(e) => setActive(e.value)} placeholder="Selecione o status" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateLevel;