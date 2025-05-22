import React, {useEffect, useState, useRef, FormEvent} from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { ContextMenu } from 'primereact/contextmenu';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import Toast from '../../../components/Toast';
import ReactDOM from 'react-dom/client';

import apiZen from '../../../services/apiZen';
import { useCookies } from 'react-cookie';
import { SelectButton } from 'primereact/selectbutton';

// import './Clients.css';

const Clients = () => {
    const [getClients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getFirst, setFirst] = useState(0);
    const [totalRecords, setTotalRecords] = useState();

    const [getCookies] = useCookies<any>();

    const [showDialog1, setShowDialog1] = useState<boolean>();
    const [showDialog2, setshowDialog2] = useState<boolean>();
    const [showDialog3, setshowDialog3] = useState<boolean>(false);
    const [showDialog4, setShowDialog4] = useState<boolean>(false);
    
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [getIdCliente, setIdCliente] = useState<string>("");
    const [getNome, setNome] = useState<string>("");
    const [getUsername, setUsername] = useState<string>();
    const [getValidade, setValidade] = useState<string>();
    const [getCnpj, setCnpj] = useState<string>();
    const [getZenUpdate, setZenUpdate] = useState<boolean|undefined>(false);

    const [getSelectValue, setSelectValue] = useState('CNPJ');
    const options = ['CNPJ', 'CPF'];

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        IdCliente: { value: '', matchMode: FilterMatchMode.CONTAINS },
        Nome: { value: '', matchMode: FilterMatchMode.CONTAINS },
        Validade: { value: '', matchMode: FilterMatchMode.CONTAINS },
        CNPJ: { value: '', matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    // const [sortField, setSortField] = useState<string>('lastModified');
    // const [sortOrder, setSortOrder] = useState<any>(-1);
    // const [date, setDate] = useState<Date | null>(new Date());

    const ctxmnu = useRef<any>(null);
    const rowsPag = 10;

    const menuModel = [
        {label: 'Atualizar dados cliente', icon: "pi pi-fw pi-user-edit", command: () => {setshowDialog2(true); setUsername(selectedClient.Nome); setCnpj(selectedClient.CNPJ); setZenUpdate(selectedClient.ZenUpdate)}},
        {label: 'Atualizar validade'     , icon: "pi pi-fw pi-pencil"   , command: () => {setShowDialog1(true); setValidade(selectedClient.Validade); setZenUpdate(selectedClient.ZenUpdate)}},
        {label: 'Excluir'                , icon: 'pi pi-fw pi-times'    , command: () => {setshowDialog3(true); setUsername(selectedClient.Nome); }}
    ];

    /*************************************************
     *  Funcao chamada na contrucao do componente
    **************************************************/
    useEffect(() => { 
        fetchData(rowsPag);
    }, []); 

    // const onPage = (event: any) => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         const startIndex = event.first;
    //         const endIndex = event.first + rowsPag;
    //         fetchData(endIndex);
    //         setFirst(startIndex);
    //         setClients(datasource.slice(startIndex, endIndex));
    //         setLoading(false);
    //     })
    // };

    const onGlobalFilterChange = (e: any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // Validate Dates in the Format of dd/mm/yyyy
    // https://www.scaler.com/topics/date-validation-in-javascript/
    function isValidDate(sDate: string) {
        let dateformat = /^(0[1-9]|[1-2][0-9]|3[01])[\/](0[1-9]|1[0-2])[\/]\d{4}$/;  // /^(0?[1-9]|[1-2][0-9]|3[01])[\/](0?[1-9]|1[0-2])[\/]\d{4}$/;

        // Matching the sDate through regular expression      
        if (sDate?.match(dateformat)) {
            let operator = sDate.split('/');

            // Extract the string into day, month, year
            let datepart: any = [];
            if (operator.length > 1) {
                datepart = sDate.split('/');
            }
            let day = parseInt(datepart[0]);
            let month = parseInt(datepart[1]);
            let year = parseInt(datepart[2]);

            // Create a list of days of a month      
            let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month == 1 || month > 2) {
                if (day > ListofDays[month - 1]) { // To check if the date is out of range 
                    return false;
                }
            } else if (month == 2) {
                let leapYear = false;
                if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
                if ((leapYear == false) && (day >= 29)) {
                    return false;
                }
                else
                    if ((leapYear == true) && (day > 29)) {
                        return false;
                    }
            }
        } else {
            return false;
        }
        return true;
    }

    function isCnpj(CNPJ: string) {
        var cCNPJ = CNPJ?.replace(/[^0-9]/g,"");
        return (cCNPJ?.length == 14) || CNPJ?.includes("/");
    }

    // function showToast(messageType: string, messageTitle: string, messageContent: string) {
    //     setToast(false)
    //     setMessageType(messageType);
    //     setMessageTitle(messageTitle);
    //     setMessageContent(messageContent);
    //     setToast(true);
    //     setTimeout(() => {
    //         setToast(false);
    //     }, 6500)
    // }

    /*************************************************
     * Funcao usada para buscar clientes no backend e retornar para datatable
     * Parametros:
     *  endIndex: valor do ultimo registro mostrado na pagina da tabela
    **************************************************/
    async function fetchData(endIndex: number) {
        setLoading(true);
        try {
            if(getCookies){
                if (getCookies?.token) {
                    console.log(getCookies)
                    await apiZen.get(`/allclients`).then(response => {
                        setLoading(true);
                        if (response.data.showClients) {
                            setTimeout(() => {
                                setClients(response.data.clients);
                                setTotalRecords(response.data.length);
                                setLoading(false);
                            }, 500)
                        }else{
                            setLoading(false);
                            //@ts-ignore
                            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={response?.data?.error || response}/>)
                        }
                    }).catch(err => {
                        setLoading(false);
                        
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                    })
                }else{
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Acesso Negado!"}/>)
                }    
            }

        } catch (error) {
            return;
        }
    }

    /*************************************************
     * Funcao usada para excluir determinado cliente selecionado a partir de IdCliente
    **************************************************/
    async function handleDelete() {       
        try {
            console.log(getCookies)
            await apiZen.delete(`/clients/${selectedClient?.IdCliente}`, {headers: {accessToken: getCookies.token}}).then(response => {
                if(response?.data){
                    if (response?.data?.deletedClient) {
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Exclusão"} message={"Cliente excluído com sucesso!"}/>)
                    }else{
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"response.data.error"}/>)
                    }
                }else{
                    throw response;
                }
                fetchData(getFirst + rowsPag);
                setshowDialog3(false);
            }).catch(err => {
                //@ts-ignore
                ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                setLoading(false);
            })
        } catch (error) {
            console.error(error);
            setshowDialog3(false);
        }
    }

    async function handleCreate(event: FormEvent){
        event.preventDefault();
        try {
            apiZen.post("/clients", {IdCliente: getIdCliente, CNPJ: getCnpj, Nome: getNome, Validade: getValidade}, {headers: {accessToken: getCookies.userData.AccessToken}}).then((response: any) => {
                if (response.data.createdClient){
                    setTimeout(() => {
                        setShowDialog4(false);
                    }, 1500)
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Criação"} message={"Cliente criado com sucesso!"}/>)
                }else{
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                }
            }).catch((err: any) => {
                if (err.response === undefined) {
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                }else if(!err.response.data.userLogin && err.response.status === 400){
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                }else{
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                }
            })
        } catch (error) {
            console.error(error);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={error}/>)

        }
    }
    
    async function handleUpdateValiditySubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        
        var Validade = getValidade;
        
        if (Validade === undefined || ! isValidDate(Validade)){
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Data inválida"}/>)
        }else{
            try {
                apiZen.put(`/clients/validity/${selectedClient.IdCliente}`, {Validade: Validade, ZenUpdate: getZenUpdate}, {headers: {accessToken: getCookies.token}}).then(response => {
                    if (response.data.updatedClient) {
                        setShowDialog1(false);
                        setValidade('');
                        
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Atualização"} message={"Data de validade atualizada com sucesso!"}/>)
                    }else{
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={response?.data?.error || response}/>)
                    }
                    fetchData(getFirst + rowsPag);
                    setLoading(false);
                }).catch(err => {
                    setLoading(false);

                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err.response.data.error}/>)
                })
            } catch (error) {
                console.error(error);
                setLoading(false);
                return
            }
        }
    }

    async function handleUpdateSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        try {
            apiZen.put(`/clients/${selectedClient.IdCliente}`, {Nome: getUsername, CNPJ: getCnpj, ZenUpdate: getZenUpdate}, {headers: {accessToken: getCookies.token}}).then(response => {
                if(response){
                    if (response?.data?.updatedClient) {
                        setshowDialog2(false);
                        setUsername('');
                        setCnpj('');
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"success"} title={"Atualização"} message={"Dados atualizados com sucesso!"}/>)
                    }else{
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={response?.data?.error || response}/>)
                    }
                    fetchData(getFirst + rowsPag);
                }else{
                    throw response;
                }
                setLoading(false);
            }).catch(err => {               
                //@ts-ignore
                ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={err.response.data.error +  " Status de erro: " + err.response.status}/>)
                
                setLoading(false);
            })
        } catch (error) {
            console.error(error)
            
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro"} message={error}/>)
            setLoading(false);
            return
        }
    }

    /************************
     * Templates
     ************************/
    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Busca..." />
                </IconField>
                <Button className="ml-4 p-button-success" icon="pi pi-refresh" onClick={() => fetchData(0)} tooltip="Atualizar Clientes" loading={loading}/>
                <Button className="ml-4 p-button-info" icon="pi pi-plus" onClick={() => setShowDialog4(true)} tooltip="Criar Registro"/>
            </div>          
        );
    };
    const header = renderHeader();

    function showMasked(cCNPJ: string) {
        var cCNPJMasked: string = cCNPJ.replace(/[^0-9]/g,"");                         // CNPJ apenas com numeros;
        if (isCnpj(cCNPJ)) {
            var cCNPJRegEx = cCNPJMasked.match(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/); // "99.999.999/9999-99"
            cCNPJMasked = (cCNPJRegEx?.toString() == null ? "" : cCNPJRegEx[1] + "." + cCNPJRegEx[2] + "." + cCNPJRegEx[3] + "/" + cCNPJRegEx[4] + "-" + cCNPJRegEx[5]);
        } else {
            var cCNPJRegEx = cCNPJMasked.match(/(\d{3})(\d{3})(\d{3})(\d{2})/);        // "999.999.999-99"
            cCNPJMasked = (cCNPJRegEx?.toString() == null ? "" : cCNPJRegEx[1] + "." + cCNPJRegEx[2] + "." + cCNPJRegEx[3] + "-" + cCNPJRegEx[4]);
        }
        return cCNPJMasked;
    }

    const idClienteTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">ID</span>
                <a>{rowData.IdCliente}</a>
            </React.Fragment>
        );
    }

    const nomeTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <p className="p-column-title">Nome</p>
                <a>{rowData.Nome}</a>
            </React.Fragment>
        );
    }

    const validadeTemplate = (rowData: any) => {
        let verifyStatus = rowData.statusValidade;
        let fontColor: any = verifyStatus == true ? "#a80000" : "#106b00";
        let fontBold: any = verifyStatus == true ? "bold" : "bold";

        return (
            <React.Fragment>
                <span className="p-column-title">Validade</span>
                <a style={{ color: fontColor, fontWeight: fontBold }}>{rowData.Validade}</a>
            </React.Fragment>
        );
    }

    const cnpjTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">CNPJ/CPF</span>
                {showMasked(rowData.CNPJ)}
            </React.Fragment>
        );
    }

    const updatedAtTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Última atualização</span>
                {rowData.updated_at}
            </React.Fragment>
        );
    }

    const dtReferenciaTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">Dt referência</span>
                <a>{rowData.DtReferencia}</a>
            </React.Fragment>
        );
    }

    const zenUpdateTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <span className="p-column-title">É atualizável?</span>
                <Checkbox checked={rowData.ZenUpdate} readOnly></Checkbox>
                {/* {zenupdate} */}
            </React.Fragment>
        );
    }

    // https://primereact.org/datatable/
    return (
        <>
            <div className="grid block justify-center no-select mx-auto col-12 md:col-11">
                <ContextMenu model={menuModel} ref={ctxmnu}/>
                <div className="datatable-responsive-demo">
                    <DataTable className="p-datatable-responsive-demo datatable-templating-demo"
                        id='clientsTable'
                        dataKey='IdCliente'
                        value={getClients}
                        paginator={true}
                        rows={rowsPag}
                        header={header}
                        totalRecords={totalRecords}
                        resizableColumns={true}
                        filters={filters}
                        filterDisplay='row'
                        globalFilterFields={['IdCliente', 'Nome', 'Validade', 'CNPJ']}
                        sortOrder={1}
                        removableSort={true}
                        lazy={false}
                        first={getFirst}
                        loading={loading} 
                        contextMenuSelection={selectedClient}
                        onContextMenuSelectionChange={e => setSelectedClient(e.value)}
                        onContextMenu={e => ctxmnu.current.show(e.originalEvent)}>
                        <Column className="" field="IdCliente"    header="ID"                 sortable        body={idClienteTemplate}></Column>
                        <Column className="" field="Nome"         header="Nome"               sortable filter body={nomeTemplate} style={{  }}></Column>
                        <Column className="" field="Validade"     header="Validade"           filter body={validadeTemplate}></Column>
                        <Column className="" field="CNPJ"         header="CNPJ/CPF"           sortable        body={cnpjTemplate}></Column>
                        <Column className="" field="updated_at"   header="Última Atualização" sortable        body={updatedAtTemplate}></Column>
                        <Column className="" field="dtReferencia" header="Dt referência"      sortable        body={dtReferenciaTemplate}></Column>
                        <Column className="" field="zenupdate"    header="Atualizável"        sortable        body={zenUpdateTemplate}></Column>
                    </DataTable>
                </div>
                <Dialog header="Criar cliente" visible={showDialog4} style={{ width: '50vw' }} onHide={() => setShowDialog4(false)}>
                    <form onSubmit={handleCreate}>
                        <SelectButton className="col-12 pt-0 pl-0" value={getSelectValue} options={options} onChange={(e) => {setSelectValue(e.value); setCnpj('')}} />
                        <div className="p-grid p-fluid">
                            <div className="col-12 pt-4 pl-0">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputText id="idCliente" value={getIdCliente} onChange={(e) => setIdCliente((e.target as HTMLInputElement).value)} />
                                        <label htmlFor="IdCLiente">IdCliente</label>
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 pt-4 pl-0">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                    {getSelectValue === 'CNPJ' 
                                        ?
                                        <>
                                            <InputMask mask="99.999.999/9999-99" id="cnpj" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} />
                                            <label htmlFor="cnpj">CNPJ</label>
                                        </>
                                        :
                                        <>
                                            <InputMask mask="999.999.999-99" id="cpf" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} />
                                            <label htmlFor="cpf">CPF</label>
                                        </>
                                    }
                                    </span>  
                                </div>
                            </div>

                            <div className="col-12 pt-4 pl-0">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputText id="nome" value={getNome} onChange={(e) => setNome((e.target as HTMLInputElement).value)} />
                                        <label htmlFor="nome">Nome</label>
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 pt-4 pl-0">
                                <div className="p-inputgroup">
                                    <span className="p-float-label">
                                        <InputMask mask="99/99/9999" id="validade" value={getValidade} onChange={(e) => setValidade((e.target as HTMLInputElement).value)} tooltip="DD/MM/YYYY" tooltipOptions={{position: 'bottom'}}/>
                                        <label htmlFor="validade">Validade</label>
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 pt-3 pb-4 pl-0">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="checkBoxAtualizavel" 
                                            onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} 
                                            checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                    <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                                </div>
                            </div>
                        </div>
                        <Button label="Cadastrar" icon="pi pi-send" iconPos="right" className="ml-lg-3"/>
                        {/* <div className="p-fluid">
                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                <InputMask className="p-lg-12" mask="99/99/9999" id="validade" value={getValidade} onChange={(e) => setValidade((e.target as HTMLInputElement).value)} required/>
                                <label htmlFor="validade">Validade</label>
                                </span>
                            </div>
                        </div>

                        <div className="p-col-12 p-lg-12 my-3">
                            <div className="flex align-items-center">
                                <Checkbox id="zenupdate" inputId="checkBoxAtualizavel" onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                            </div>
                        </div>

                        <Button label="Atualizar" icon="pi pi-check" className="p-ml-2" iconPos="right" loading={loading}/> */}
                    </form>
                </Dialog>
                <Dialog header="Atualizar validade" visible={showDialog1} style={{ width: '50vw' }} onHide={() => setShowDialog1(false)}>
                    <form onSubmit={handleUpdateValiditySubmit}>
                        <div className="p-fluid">
                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                <InputMask className="p-lg-12" mask="99/99/9999" id="validade" value={getValidade} onChange={(e) => setValidade((e.target as HTMLInputElement).value)} required/>
                                <label htmlFor="validade">Validade</label>
                                </span>
                            </div>
                        </div>

                        <div className="p-col-12 p-lg-12 my-3">
                            <div className="flex align-items-center">
                                <Checkbox id="zenupdate" inputId="checkBoxAtualizavel" onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                            </div>
                        </div>

                        <Button label="Atualizar" icon="pi pi-check" className="p-ml-2" iconPos="right" loading={loading}/>
                    </form>
                </Dialog>
                <Dialog header="Atualizar dados" visible={showDialog2} style={{ width: '50vw' }} onHide={() => setshowDialog2(false)}>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="p-fluid">
                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                    <InputText id="nome" value={getUsername} onChange={(e) => setUsername((e.target as HTMLInputElement).value)} required/>
                                    <label htmlFor="nome">Nome</label>
                                </span>
                            </div>

                            <div className="p-col-12 p-lg-12 my-3 pb-3">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="checkBoxAtualizavel" 
                                            onChange={e => {setZenUpdate(e.checked === undefined ? false : e.checked)}} 
                                            checked={getZenUpdate === undefined ? false : getZenUpdate} />
                                    <label htmlFor="checkBoxAtualizavel" className="ml-2">É Atualizavel?</label>
                                </div>
                            </div>

                            <div className="p-col-12 p-lg-12 my-3">
                                <span className="p-float-label">
                                    { isCnpj(getCnpj!)
                                        ?
                                            <>
                                                <InputMask mask="99.999.999/9999-99" id="cnpj" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} required/>
                                                <label htmlFor="cnpj">CNPJ</label>
                                            </>
                                        :
                                            <>
                                                <InputMask mask="999.999.999-99" id="cpf" value={getCnpj} onChange={(e) => setCnpj((e.target as HTMLInputElement).value)} required/>
                                                <label htmlFor="cpf">CPF</label>
                                            </>
                                    }
                                </span>
                            </div>
                        </div>
                        <Button label="Atualizar" type="submit" icon="pi pi-check" className="p-ml-2" iconPos="right" loading={loading}/>
                    </form>
                </Dialog>
                <Dialog header="Confirmar exclusão" visible={showDialog3} style={{ width: '60vw' }} onHide={() => setshowDialog3(false)}>
                    <p>Deseja exluir o registro {getUsername}?</p>
                    <Button className='p-button-danger' label='Sim' onClick={handleDelete}></Button>
                    <Button className='p-button-success ml-3' label='Nao' onClick={() => setshowDialog3(false)}></Button>
                </Dialog>
            </div>
        </>
    )
}

export default Clients;