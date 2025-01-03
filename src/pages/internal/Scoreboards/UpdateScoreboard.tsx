import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';
import { Dropdown } from 'primereact/dropdown';

import apiGrb from '../../../services/apiGrb';
import Toast from '../../../components/Toast';

const UpdateScoreboard = (props:any) => {
    const [getId, setId] = useState<any>();
    const [getName, setName] = useState<any>('');
    const [getValue, setValue] = useState<any>('');
    const [getActive, setActive] = useState<any>('');
    const [getGameName, setGameName] = useState<any>('');
    const [getNameTeam01, setNameTeam01] = useState<any>('');
    const [getNameTeam02, setNameTeam02] = useState<any>('');
    const [getScoreTeam01, setScoreTeam01] = useState<any>('0');
    const [getScoreTeam02, setScoreTeam02] = useState<any>('0');
    const [getLoading, setLoading] = useState(false);
    
    useEffect(() => {
        setGameName(props?.gameName || undefined);
        setNameTeam01(props?.nameTeam01 || undefined);
        setNameTeam02(props?.nameTeam02 || undefined);
        setScoreTeam01(props?.scoreTeam01 || undefined);
        setScoreTeam02(props?.scoreTeam02 || undefined);
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
        console.log(getId)
        await apiGrb.put("/scoreboard", {
            id: getId, 
            GameName: getGameName, 
            NameTeam01: getNameTeam01, 
            NameTeam02: getNameTeam02, 
            ScoreTeam01: getScoreTeam01, 
            ScoreTeam02: getScoreTeam02, 
            Active: getActive
        }).then((response:any) => {
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
                    <InputText id="user" className="w-12" value={getGameName} onChange={(e) => {setGameName(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome do Jogo</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getNameTeam01} onChange={(e) => {setNameTeam01(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome Time 01</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getNameTeam02} onChange={(e) => {setNameTeam02(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Nome Time 02</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getScoreTeam01} onChange={(e) => {setScoreTeam01(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Placar Time 01</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getScoreTeam02} onChange={(e) => {setScoreTeam02(e.target.value)}} disabled={getLoading}/>
                    <label htmlFor="user">Placar Time 02</label>
                </span>
                <p className="mb-2">Acontecendo Agora?</p>
                <Dropdown className="col-12 mb-3" value={getActive} options={statusPossibilities} onChange={(e) => setActive(e.value)} placeholder="Selecione o status" disabled={getLoading}/>
                <Button type="submit" label="Atualizar" loading={getLoading}/>
            </form>
        </>
    )
}

export default UpdateScoreboard;