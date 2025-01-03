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
import UpdateLevel from './Levels/UpdateLevel';
import UpdateLevelStatus from './Levels/UpdateLevelStatus';
import DeleteLevel from './Levels/DeleteLevel';
import CreateNewLevel from './Levels/CreateNewLevel';

const DataTableLevels = () => {
    const [getLevels, setLevels] = useState();
    const [getLoading, setLoading] = useState(true);
    const [getSelectedLevel, setSelectedLevel] = useState({});
    const [getShowDialogUpdate, setShowDialogUpdate] = useState(false);
    const [getShowDialogCreate, setShowDialogCreate] = useState(false);
    const [getEditableStatus, setEditableStatus] = useState('');

    const [getId, setId] = useState<any>();
    const [getName, setName] = useState<any>();
    const [getValue, setValue] = useState<any>();
    const [getActive, setActive] = useState<any>();

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
        {label: 'Atualizar Nível', value: "updateLevel"},
        {label: 'Atualizar Status', value: "updateLevelStatus"},
        {label: 'Excluir Nível', value: "deleteLevel"},
    ];

    useEffect(() => {   
        fetchData();
    }, []);

    async function fetchData(){
        setLoading(true);
        await apiGrb.get("levels")
        .then(response => {
            setLevels(response.data.levels);
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
            return <Tag value={"Não"} icon="pi pi-times" severity={"danger"} className="ml-2"/>            
        }
    }

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
                    <Button className="ml-4" icon="pi pi-plus" tooltip="Criar Nível" onClick={() => setShowDialogCreate(true)}/>
                    <Button className="ml-4 p-button-success" icon="pi pi-refresh" tooltip="Atualizar lista" onClick={() => fetchData()} loading={getLoading}/>
                </span>
            </div>
        )
    }
    const header2 = renderHeader2();

    const onRowSelect = (event:any) => {
        setId(event.data.id);
        setName(event.data.Name);
        setValue(event.data.Value);
        setActive(event.data.Active);
        setShowDialogUpdate(true);
    }

    const handleHide = () => {
        setShowDialogCreate(false); 
        setShowDialogUpdate(false); 
        setSelectedLevel({}); 
        fetchData();
        setEditableStatus('');
    }
    
    return (
        <>
            <DataTable value={getLevels} responsiveLayout="stack" paginator rows={10} rowsPerPageOptions={[5,10,25,50]} emptyMessage="Nível não encontrado." 
                            header={header2} filters={getFilter} loading={getLoading} resizableColumns columnResizeMode="expand" removableSort selectionMode="single" 
                            selection={getSelectedLevel} onSelectionChange={e => setSelectedLevel(e.value)} dataKey="id" onRowSelect={onRowSelect} metaKeySelection={false}>
                <Column field="Name" header="Nome" sortable></Column>
                <Column field="Value" header="Representação" sortable></Column>
                <Column field="Active" header="Ativo?" body={statusActiveTemplate} sortable></Column>
            </DataTable>

            <Dialog className="z-1" header="Criar Nível" visible={getShowDialogCreate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <CreateNewLevel/>
            </Dialog>

            <Dialog className="z-1" header={`Gerenciar Nível ${getName}`} visible={getShowDialogUpdate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <div className="mb-5">
                    <p className="my-2">Tipo:</p>
                    <Dropdown className="col-12" value={getEditableStatus} options={statusPossibilitiesUpdate} onChange={(e) => setEditableStatus(e.value)} optionLabel="label" placeholder="Selecione um tipo de gerenciamento" />
                </div>
                {getEditableStatus === "updateLevel" && <UpdateLevel id={getId} levelName={getName} levelValue={getValue} levelActive={getActive}/>}
                {getEditableStatus === "updateLevelStatus" && <UpdateLevelStatus id={getId} levelActive={getActive}/>}
                {getEditableStatus === "deleteLevel" && <DeleteLevel id={getId}/>}
            </Dialog>
        </>
    )
}

export default DataTableLevels;