import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';
import { Dropdown } from 'primereact/dropdown';

const UpdateConfig = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getConfigName, setConfigName] = useState<any>('');
    const [getConfigValue, setConfigValue] = useState<any>();
    const [getUsername, setUsername] = useState<any>();
    const [getLoading, setLoading] = useState(false);

    const statusPossibilities = [
        {label: 'Ciclo Atual', value: "actualCycle"},
        {label: 'Url do Repositório', value: "repositoryUrlGithub"},
        {label: 'Url de informações do repositório', value: "repositoryUrl"},
        {label: 'Nome a ser mostrado', value: "repositoryNameCustom"},
    ];

    useEffect(() => {
        setId(props?.id || undefined);
        setConfigName(props?.nameConfig || undefined);
        setConfigValue(props?.valueConfig || undefined);
        setUsername(props?.usernameConfig || undefined);
    }, []);

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/config", {id: getId, ConfigName: getConfigName, ConfigValue: getConfigValue, Username: getUsername}).then((response:any) => {
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
                {/* <span className="p-float-label mb-4 mt-4">
                    <InputText id="nameInstructor" className="w-12" value={getConfigName} onChange={(e) => {setConfigName(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="nameInstructor">Nome</label>
                </span> */}
                <p className="my-2">Tipo de Configuração</p>
                <Dropdown className="col-12 mb-3" value={getConfigName} options={statusPossibilities} onChange={(e) => setConfigName(e.value)} placeholder="Selecione a configuração" disabled={true}/>

                <span className="p-float-label mb-2 mt-4">
                    <InputText id="desc" className="w-12" value={getConfigValue} onChange={(e) => {setConfigValue(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="desc">Valor</label>
                </span>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateConfig;