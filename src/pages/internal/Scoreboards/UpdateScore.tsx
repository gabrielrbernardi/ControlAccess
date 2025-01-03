import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

const UpdateScore = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getNameTeam01, setNameTeam01] = useState<any>('');
    const [getNameTeam02, setNameTeam02] = useState<any>('');
    const [getScoreTeam01, setScoreTeam01] = useState<any>('0');
    const [getScoreTeam02, setScoreTeam02] = useState<any>('0');
    const [getLoading, setLoading] = useState(false);
    
    useEffect(() => {
        setNameTeam01(props?.nameTeam01 || undefined);
        setNameTeam02(props?.nameTeam02 || undefined);
        setScoreTeam01(props?.scoreTeam01 || undefined);
        setScoreTeam02(props?.scoreTeam02 || undefined);
        setId(props?.id || undefined);
    }, [])

    const statusPossibilities = [
        {label: 'Sim', value: true},
        {label: 'Não', value: false},
    ];

    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.put("/scoreboard/score", {id: getId, ScoreTeam01: getScoreTeam01, ScoreTeam02: getScoreTeam02}).then((response:any) => {
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
                    <InputNumber id="user" className="w-12" value={getScoreTeam01} onChange={(e) => {setScoreTeam01(e.value)}} disabled={getLoading} showButtons buttonLayout="horizontal" decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" min={0}/>
                    <label htmlFor="user">Placar {getNameTeam01}</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputNumber id="user2" className="w-12" value={getScoreTeam02} onChange={(e) => {setScoreTeam02(e.value)}} disabled={getLoading} showButtons buttonLayout="horizontal" decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" min={0}/>
                    <label htmlFor="user2">Placar {getNameTeam02}</label>
                </span>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateScore;