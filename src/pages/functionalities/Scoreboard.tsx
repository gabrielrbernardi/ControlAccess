import React, { useEffect, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Toast from '../../components/Toast';
import apiGrb from '../../services/apiGrb';
import { Tag } from 'primereact/tag';

const Scoreboard = () => {
    const [getScoreboards, setScoreboards] = useState();
    const [getLoading, setLoading] = useState(true);
    const [getSelectedScoreboard, setSelectedScoreboard] = useState({});
    const [getShowDialogUpdate, setShowDialogUpdate] = useState(false);
    const [getShowDialogCreate, setShowDialogCreate] = useState(false);
    const [getEditableStatus, setEditableStatus] = useState('');

    const [getId, setId] = useState<any>();
    const [getName, setName] = useState<any>();
    const [getValue, setValue] = useState<any>();
    const [getActive, setActive] = useState<any>();
    const [getFilterValue, setFilterValue] = useState('');

    useEffect(() => {   
        fetchData();
        setInterval(() => {
            fetchData()
        }, 15000)
        // fetchData()
    }, []);

    async function fetchData(){
        console.log("carregando.....")
        setLoading(true);
        await apiGrb.get("scoreboards")
        .then(response => {
            setScoreboards(response.data.games);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Erro ao buscar os valores."}/>);
        })
    }

    const statusActiveTemplate = (rowData: any) => {
        if(rowData.Active === true){
            return <Tag value={"Sim"} icon="pi pi-check" severity={"success"} className="ml-2"/>
        }else{
            return <Tag value={"Finalizado"} icon="pi pi-times" severity={"warning"} className="ml-2"/>            
        }
    }

    return (
        <DataTable value={getScoreboards} responsiveLayout="stack" paginator rows={100} emptyMessage="Placar não encontrado." 
                    loading={getLoading} resizableColumns columnResizeMode="expand" selectionMode="single" 
                    dataKey="id" metaKeySelection={false} sortField="Active" sortOrder={-1}>
        <Column field="GameName" header="Jogo"></Column>
        <Column field="NameTeam01" header="Time A"></Column>
        <Column field="ScoreTeam01" header="Placar A"></Column>
        <Column field="ScoreTeam02" header="Placar B"></Column>
        <Column field="NameTeam02" header="Time B"></Column>
        <Column field="Active" header="Agora?" body={statusActiveTemplate} sortable></Column>
    </DataTable>
    )
}

export default Scoreboard;