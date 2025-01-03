import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';
import { Dropdown } from 'primereact/dropdown';

const CreateNewInstructor = (props:any) => {
    const [getConfigName, setConfigName] = useState<any>();
    const [getConfigValue, setConfigValue] = useState<any>();
    const [getLoading, setLoading] = useState(false);
    
    //repositoryUrl
    //repositoryUrlGithub
    //repositoryNameCustom
    //actualCycle

    const statusPossibilities = [
        {label: 'Ciclo Atual', value: "actualCycle"},
        {label: 'Url do Repositório', value: "repositoryUrl"},
        // {label: 'Url do Repositório', value: "repositoryUrlGithub"},
        {label: 'Nome a ser mostrado', value: "repositoryNameCustom"},
    ];

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.post("/config", {ConfigName: getConfigName, ConfigValue: getConfigValue}).then((response:any) => {
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
                {/* <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getConfigName} onChange={(e) => {setConfigName(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome</label>
                </span> */}
                <p className="my-2">Tipo de Configuração</p>
                <Dropdown className="col-12 mb-3" value={getConfigName} options={statusPossibilities} onChange={(e) => setConfigName(e.value)} placeholder="Selecione a configuração" disabled={getLoading}/>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="user" className="w-12" value={getConfigValue} onChange={(e) => {setConfigValue(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Valor</label>
                </span>
                <Button type="submit" label="Criar" loading={getLoading}/>
            </form>
        </>
    )
}

export default CreateNewInstructor;