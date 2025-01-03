import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';
import { Dropdown } from 'primereact/dropdown';

const UpdateLink = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getNameInstructor, setNameInstructor] = useState<any>('');
    const [getDescription, setDescription] = useState<any>();
    const [getLinkUrl, setLinkUrl] = useState<any>();
    const [getLoading, setLoading] = useState(false);


    useEffect(() => {
        setId(props?.id || undefined);
        setNameInstructor(props?.nameInstructor);
        setDescription(props?.descriptionInstructor || undefined);
        setLinkUrl(props?.urlInstructor || undefined);
    }, []);

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/instructor", {id: getId, Name: getNameInstructor, Description: getDescription, Url: getLinkUrl}).then((response:any) => {
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
                    <InputText id="nameInstructor" className="w-12" value={getNameInstructor} onChange={(e) => {setNameInstructor(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="nameInstructor">Nome</label>
                </span>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="desc" className="w-12" value={getDescription} onChange={(e) => {setDescription(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="desc">Descrição</label>
                </span>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="url" className="w-12" value={getLinkUrl} onChange={(e) => {setLinkUrl(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="url">URL</label>
                </span>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateLink;