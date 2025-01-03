import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateLinkOwner = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getOwner, setOwner] = useState<any>('');
    const [getLoading, setLoading] = useState(false);

    const [getUserOptions, setUserOptions] = useState<any>();
    
    useEffect(() => {
        fetchData()
        setId(props?.id || undefined);
        setOwner(props?.linkOwner);
    }, [])

    // const statusPossibilities = [
    //     {label: 'Sim', value: true},
    //     {label: 'Não', value: false},
    // ];

    async function fetchData(){
        setLoading(true);
        await apiGrb.get("user/filtered")
        .then(response => {
            let list = [{}];
            list.pop();
            list.push({label: "Todos", value: "admin"})
            response.data.users.map((valor:any, id:any) => {
                list.push({label: valor.Name, value: valor.Username})
            })
            setUserOptions(list)
            setLoading(false);
        })
        .catch(err => console.log(err));
    }

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/link/owner", {id: getId, Username: getOwner}).then((response:any) => {
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
                <p className="mb-2">Propriedade</p>
                <Dropdown className="col-12 mb-3" value={getOwner} options={getUserOptions} optionValue="value" onChange={(e) => setOwner(e.value)} placeholder="Selecione o proprietário" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateLinkOwner;