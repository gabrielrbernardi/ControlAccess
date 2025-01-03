import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateLinkBadge = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getOption, setOption] = useState<any>(null);
    const [getBadge, setBadge] = useState<any>();
    const [getBadgeLabel, setBadgeLabel] = useState<any>();
    const [getBadgeType, setBadgeType] = useState<any>();
    const [getLoading, setLoading] = useState(false);

    const [getLevelOptions, setLevelOptions] = useState<any>();

    const statusPossibilities = [
        {label: 'Sim', value: true},
        {label: 'Não', value: false},
    ];
    
    const badgeTypePossibilities = [
        {label: 'Primário', value: "primary"},
        {label: 'Sucesso', value: "success"},
        {label: 'Informação', value: "info"},
        {label: 'Alerta', value: "warning"},
        {label: 'Perigo', value: "danger"},
    ];

    useEffect(() => {
        // fetchData()
        setId(props?.id || undefined);
        setBadge((props?.linkBadge == true || props?.linkBadge == false) ? Boolean(props?.linkBadge) : undefined);
        setBadgeLabel(props?.linkBadgeLabel || undefined);
        setBadgeType(props?.linkBadgeType || undefined);
    }, []);

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/link/badge", {id: getId, Badge: getBadge, BadgeLabel: getBadgeLabel, BadgeType: getBadgeType}).then((response:any) => {
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
                <p className="mb-2">Visível?</p>
                <Dropdown className="col-12 mb-2" value={getBadge} options={statusPossibilities} onChange={(e) => setBadge(e.value)} placeholder="Selecione a opção" disabled={getLoading}/>
                <span className="p-float-label mb-2 mt-4">
                    <InputText id="user" className="w-12" value={getBadgeLabel} onChange={(e) => {setBadgeLabel(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome Badge</label>
                </span>
                {/* <Dropdown className="col-12 mb-3" value={getLevel} options={getLevelOptions} onChange={(e) => setLevel(e.value)} placeholder="Selecione o status" disabled={getLoading}/> */}
                <p className="mb-2 mt-0">Tipo</p>
                <Dropdown className="col-12 mb-2" value={getBadgeType} options={badgeTypePossibilities} onChange={(e) => setBadgeType(e.value)} placeholder="Selecione a opção" disabled={getLoading}/>
                {/* <span className="p-float-label mb-2 mt-4">
                    <InputText id="user" className="w-12" value={getBadgeType} onChange={(e) => {setBadgeType(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Tipo Badge</label>
                </span> */}
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateLinkBadge;