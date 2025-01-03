import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import ReactDOM from 'react-dom/client';

import Toast from '../../../components/Toast';
import apiGrb from '../../../services/apiGrb';

const CreateNewScoreboard = (props:any) => {
    const [getGameName, setGameName] = useState<any>('');
    const [getNameTeam01, setNameTeam01] = useState<any>('');
    const [getNameTeam02, setNameTeam02] = useState<any>('');
    const [getScoreTeam01, setScoreTeam01] = useState<any>('0');
    const [getScoreTeam02, setScoreTeam02] = useState<any>('0');
    const [getLoading, setLoading] = useState(false);
    
    async function handleSubmit(event:any){
        event?.preventDefault();
        setLoading(true);
        await apiGrb.post("/scoreboard", {
            GameName: getGameName, 
            NameTeam01: getNameTeam01, 
            NameTeam02: getNameTeam02, 
            ScoreTeam01: getScoreTeam01, 
            ScoreTeam02: getScoreTeam02
        }).then((response:any) => {
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
                    <InputText id="user" className="w-12" value={getScoreTeam01} onChange={(e) => {setScoreTeam01(e.target.value)}} disabled={true}/>
                    <label htmlFor="user">Placar Time 01</label>
                </span>
                <span className="p-float-label mb-4 mt-4">
                    <InputText id="user" className="w-12" value={getScoreTeam02} onChange={(e) => {setScoreTeam02(e.target.value)}} disabled={true}/>
                    <label htmlFor="user">Placar Time 02</label>
                </span>
                <Button type="submit" label="Criar" loading={getLoading}/>
            </form>
        </>
    )
}

export default CreateNewScoreboard;