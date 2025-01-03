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
import UpdateInstructor from './Instructors/UpdateInstructor';
import UpdateInstructorStatus from './Instructors/UpdateInstructorStatus';
import DeleteInstructor from './Instructors/DeleteInstructor';
import CreateNewInstructor from './Instructors/CreateNewInstructor';
import UpdateConfig from './Configs/UpdateConfig';
import DeleteConfig from './Configs/DeleteConfig';
import CreateNewConfig from './Configs/CreateNewConfig';
import UpdateActiveStatusConfig from './Configs/UpdateActiveStatusConfig';

const DataTableConfigs = (props: any) => {
    const [getIsAdmin, setIsAdmin] = useState<any>();

    const [getCycles, setCycles] = useState();
    const [getLoading, setLoading] = useState(true);
    const [getSelectedLink, setSelectedLinnk] = useState({});
    const [getShowDialogUpdate, setShowDialogUpdate] = useState(false);
    const [getShowDialogCreate, setShowDialogCreate] = useState(false);
    const [getEditableStatus, setEditableStatus] = useState('');

    const [getId, setId] = useState<any>();
    const [getConfigName, setConfigName] = useState<any>();
    const [getConfigValue, setConfigValue] = useState<any>();
    const [getUsernameCreation, setUsernameCreation] = useState<any>();
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
        {label: 'Atualizar Configuração', value: "updateConfig"},
        {label: 'Atualizar Status de Configuração', value: "updateActiveStatusConfig"},
        {label: 'Excluir Configuração', value: "deleteConfig"},
    ];

    useEffect(() => {  
        setIsAdmin(props?.isAdmin || false) 
        fetchData();
    }, []);

    async function fetchData(){
        setLoading(true);
        let route = "";
        if(getIsAdmin === true || props?.isAdmin === true){
            route = "configs";
        }else{
            route = "config/user";
        }
        await apiGrb.get(`${route}`)
        .then(response => {
            setCycles(response.data.configs);
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
                <a>Repositório (Códigos)</a>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={getFilterValue} onChange={handleFilterChange} placeholder="Busca" />
                    <Button className="ml-4" icon="pi pi-plus" tooltip="Criar Configuração" onClick={() => setShowDialogCreate(true)}/>
                    <Button className="ml-4 p-button-success" icon="pi pi-refresh" tooltip="Atualizar lista" onClick={() => fetchData()} loading={getLoading}/>
                </span>
            </div>
        )
    }
    const header2 = renderHeader2();

    const onRowSelect = (event:any) => {
        setId(event.data.id);
        setConfigName(event.data.ConfigName);
        setConfigValue(event.data.ConfigValue);
        setUsernameCreation(event.data.UsernameCreation);
        setActive(event.data.Active);
        setShowDialogUpdate(true);
    }

    const handleHide = () => {
        setShowDialogCreate(false); 
        setShowDialogUpdate(false); 
        setSelectedLinnk({}); 
        fetchData();
        setEditableStatus('');
    }
    
    return (
        <>
            <DataTable value={getCycles} responsiveLayout="stack" paginator rows={10} rowsPerPageOptions={[5,10,25,50]} emptyMessage="Configurações não encontradas." 
                            header={header2} filters={getFilter} loading={getLoading} resizableColumns columnResizeMode="expand" removableSort selectionMode="single" 
                            selection={getSelectedLink} onSelectionChange={e => setSelectedLinnk(e.value)} dataKey="id" onRowSelect={onRowSelect} metaKeySelection={false}>
                <Column field="ConfigName" header="Nome" sortable></Column>
                <Column field="ConfigValue" header="Valor" sortable></Column>
                <Column field="UsernameCreation" header="Usuário" sortable></Column>
                <Column field="Active" header="Ativo?" body={statusActiveTemplate} sortable></Column>
            </DataTable>

            <Dialog className="z-1" header="Criar Configuração" visible={getShowDialogCreate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <CreateNewConfig/>
            </Dialog>

            <Dialog className="z-1" header={`Gerenciar Configuração ${getConfigName}`} visible={getShowDialogUpdate} onHide={() => {handleHide()}} breakpoints={{'960px': '75vw'}} style={{width: '50vw'}} draggable={false} maximizable dismissableMask>
                <div className="mb-5">
                    <p className="my-2">Tipo:</p>
                    <Dropdown className="col-12" value={getEditableStatus} options={statusPossibilitiesUpdate} onChange={(e) => setEditableStatus(e.value)} optionLabel="label" placeholder="Selecione um tipo de gerenciamento" />
                </div>
                {getEditableStatus === "updateConfig" && <UpdateConfig id={getId} nameConfig={getConfigName} valueConfig={getConfigValue} usernameConfig={getUsernameCreation}/>}
                {getEditableStatus === "updateActiveStatusConfig" && <UpdateActiveStatusConfig id={getId} nameConfig={getConfigName} valueConfig={getConfigValue} usernameConfig={getUsernameCreation}/>}
                {/* {getEditableStatus === "updateInstructorStatus" && <UpdateInstructorStatus id={getId} instructorActive={getActive}/>} */}
                {getEditableStatus === "deleteConfig" && <DeleteConfig id={getId}/>}
            </Dialog>
        </>
    )
}

export default DataTableConfigs;