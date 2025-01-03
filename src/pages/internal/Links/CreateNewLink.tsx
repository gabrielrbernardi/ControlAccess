import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';

const CreateNewLink = (props:any) => {
    const [getNameLink, setNameLink] = useState<any>();
    const [getDescription, setDescription] = useState<any>();
    const [getLevel, setLevel] = useState<any>();
    const [getLinkUrl, setLinkUrl] = useState<any>();
    const [getLoading, setLoading] = useState(false);
    
    const [getLevelOptions, setLevelOptions] = useState<any>();

    useEffect(() => {
        fetchData()
    }, []);

    async function fetchData(){
        setLoading(true);
        await apiGrb.get("levels/simple")
        .then(response => {
            let list = [{}];
            list.pop();
            response.data.levels.map((valor:any, id:any) => {
                list.push({label: valor.Name, value: valor.Value})
            })
            console.log(response)
            setLevelOptions(list)
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.response?.data?.error || "Erro na listagem de níveis!"}/>)
        });
    }

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.post("/link", {NameLink: getNameLink, Description: getDescription, Level: getLevel, Link: getLinkUrl}).then((response:any) => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Criado!"} message={response?.data?.data || "Criado com sucesso!"}/>);
        }).catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.response?.data?.error || "Erro na atualização!"}/>)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getNameLink} onChange={(e) => {setNameLink(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome</label>
                </span>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="user" className="w-12" value={getDescription} onChange={(e) => {setDescription(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Descrição</label>
                </span>
                <p className="mb-2">Nível</p>
                <Dropdown className="col-12 mb-2" value={getLevel} options={getLevelOptions} onChange={(e) => setLevel(e.value)} placeholder="Selecione o nível" disabled={getLoading}/>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getLinkUrl} onChange={(e) => {setLinkUrl(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">URL</label>
                </span>
                <Button type="submit" label="Criar" loading={getLoading}/>
            </form>
        </>
    )
}

export default CreateNewLink;