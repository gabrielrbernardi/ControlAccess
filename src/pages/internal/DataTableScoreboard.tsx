import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import apiGrb from '../../services/apiGrb';
import Toast from '../../components/Toast';
import DeleteScoreboard from './Scoreboards/DeleteScoreboard';
import CreateNewScoreboard from './Scoreboards/CreateNewScoreboard';
import UpdateScoreboard from './Scoreboards/UpdateScoreboard';
import UpdateScoreboardStatus from './Scoreboards/UpdateScoreboardStatus';
import UpdateScore from './Scoreboards/UpdateScore';

const DataTableScoreboards = () => {
    const [getScoreboards, setScoreboards] = useState();
    const [getLoading, setLoading] = useState(true);
    const [getSelectedScoreboard, setSelectedScoreboard] = useState({});
    const [getShowDialogUpdate, setShowDialogUpdate] = useState(false);
    const [getShowDialogCreate, setShowDialogCreate] = useState(false);
    const [getEditableStatus, setEditableStatus] = useState('');

    const [getId, setId] = useState<any>();
    const [getGameName, setGameName] = useState<any>('');
    const [getNameTeam01, setNameTeam01] = useState<any>('');
    const [getNameTeam02, setNameTeam02] = useState<any>('');
    const [getScoreTeam01, setScoreTeam01] = useState<any>('0');
    const [getScoreTeam02, setScoreTeam02] = useState<any>('0');
    const [getActive, setActive] = useState<any>(false);

    const [getFilterValue, setFilterValue] = useState('');
    const [getFilter, setFilter] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'representative': { value: null, matchMode: FilterMatchMode.IN },
        'status': { value: null, matchMode: FilterMatchMode.EQUALS },
        'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const statusPossibilitiesUpdate = [
        {label: 'Atualizar Informações do Jogo', value: "updateScoreboard"},
        {label: 'Atualizar Placar', value: "updateScore"},
        {label: 'Atualizar Status', value: "updateScoreboardStatus"},
        {label: 'Excluir Placar', value: "deleteLevel"},
    ];

    useEffect(() => {   
        // fetchData();
        // setInterval(() => {
        //     fetchData()
        // }, 15000)
        fetchData()
    }, []);

    async function fetchData(){
        console.log("carregando .....")
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

    // const scoreTeam01Template = (rowData: any) => {
    //         return rowData.ScoreTeam01
    // }

    const handleFilterChange = (e:any) => {
        const value = e.target.value;
        let _filters2 = { ...getFilter };
        _filters2['global'].value = value;

        setFilter(_filters2);
        setFilterValue(value);
    }

    const renderHeader2 = () => {
        return (
            <div className="flex justify-content-between">
                <a>Níveis</a>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={getFilterValue} onChange={handleFilterChange} placeholder="Busca" />
                    <Button className="ml-4" icon="pi pi-plus" tooltip="Criar Placar" onClick={() => setShowDialogCreate(true)}/>
                    <Button className="ml-4 p-button-success" icon="pi pi-refresh" tooltip="Atualizar lista" onClick={() => fetchData()} loading={getLoading}/>
                </span>
            </div>
        )
    }
    const header2 = renderHeader2();

    const onRowSelect = (event:any) => {
        setId(event.data.id);
        setGameName(event.data.GameName);
        setNameTeam01(event.data.NameTeam01);
        setNameTeam02(event.data.NameTeam02);
        setScoreTeam01(event.data.ScoreTeam01);
        setScoreTeam02(event.data.ScoreTeam02);
        setActive(event.data.Active);
        setShowDialogUpdate(true);
    }

    const handleHide = () => {
        setShowDialogCreate(false); 
        setShowDialogUpdate(false); 
        setSelectedScoreboard({}); 
        fetchData();
        setEditableStatus('');
    }
    
    return (
        <>
            <DataTable value={getScoreboards} responsiveLayout="stack" paginator rows={100} rowsPerPageOptions={[5,10,25,50,100]} emptyMessage="Placar não encontrado." 
                            header={header2} filters={getFilter} loading={getLoading} resizableColumns columnResizeMode="expand" removableSort selectionMode="single" 
                            selection={getSelectedScoreboard} onSelectionChange={e => setSelectedScoreboard(e.value)} dataKey="id" onRowSelect={onRowSelect} metaKeySelection={false} sortField="Active" sortOrder={-1}>
                <Column field="GameName" header="Jogo"></Column>
                <Column field="NameTeam01" header="Time A"></Column>
                <Column field="ScoreTeam01" header="Placar A"></Column>
                <Column field="ScoreTeam02" header="Placar B"></Column>
                <Column field="NameTeam02" header="Time B"></Column>
                <Column field="Active" header="Agora?" body={statusActiveTemplate} sortable></Column>
            </DataTable>

            <Dialog className="z-1" header="Criar Placar" visible={getShowDialogCreate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <CreateNewScoreboard/>
            </Dialog>

            <Dialog className="z-1" header={`Gerenciar Placar ${getGameName}`} visible={getShowDialogUpdate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <div className="mb-5">
                    <p className="my-2">Tipo:</p>
                    <Dropdown className="col-12" value={getEditableStatus} options={statusPossibilitiesUpdate} onChange={(e) => setEditableStatus(e.value)} optionLabel="label" placeholder="Selecione um tipo de gerenciamento" />
                </div>
                {getEditableStatus === "updateScoreboard" && <UpdateScoreboard id={getId} gameName={getGameName} nameTeam01={getNameTeam01} nameTeam02={getNameTeam02} scoreTeam01={getScoreTeam01} scoreTeam02={getScoreTeam02} levelActive={getActive}/>}
                {getEditableStatus === "updateScore" && <UpdateScore id={getId} gameName={getGameName} nameTeam01={getNameTeam01} nameTeam02={getNameTeam02} scoreTeam01={getScoreTeam01} scoreTeam02={getScoreTeam02} levelActive={getActive}/>}
                {getEditableStatus === "updateScoreboardStatus" && <UpdateScoreboardStatus id={getId} levelActive={getActive}/>}
                {getEditableStatus === "deleteLevel" && <DeleteScoreboard id={getId}/>}
            </Dialog>
        </>
    )
}

export default DataTableScoreboards;