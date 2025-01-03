import React, { useState, useEffect } from 'react';
import {GoLocation} from 'react-icons/go';
import {AiOutlineEye} from 'react-icons/ai';
import {Card} from 'primereact/card';
import {Button} from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import { Dialog } from 'primereact/dialog';
import ToastComponent from '../components/Toast';
import { FilterMatchMode } from 'primereact/api';

import api from '../services/apiGithub';
import DataTableRepositories from "../components/DataTableRepositories";
import { useLocation } from 'react-router-dom';

const About = (props:any) => {
    const [getContentGithub, setContentGithub] = useState<any>({"lau":"al"});
    const [getContentApi, setContentApi] = useState<any>([]);
    const [getShowRepoInfo, setShowRepoInfo] = useState<any>(false);
    const [getRepositoryName, setRepositoryName] = useState<any>('');
    const [getUsername, setUsername] = useState<any>('gabrielrbernardi');
    
    const [getFilterValue, setFilterValue] = useState('');
    const [getFilter, setFilter] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'representative': { value: null, matchMode: FilterMatchMode.IN },
        'status': { value: null, matchMode: FilterMatchMode.EQUALS },
        'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    
    const [getShow, setShow] = useState(false);
    const [getType, setType] = useState();
    const [getTitle, setTitle] = useState();
    const [getMessage, setMessage] = useState();
    
    const [getLoading, setLoading] = useState<boolean>(true);
    const [isHome, setIsHome] = useState<boolean>(false);

    const { pathname } = useLocation();

    useEffect(() => {
        if(props && props.isHome){
            setIsHome(true);
            getUserData();
        }else{
            fetchData();
        }
    }, [])

    function headerCard() {
        if(!getLoading){
            if(getContentGithub){
                return <div className="mx-auto"><Image src={getContentGithub.avatar_url} alt="Logo" width="100%" className="mx-auto md:block hidden" preview/></div>
            }else{
                return <Image src={"https://avatars.githubusercontent.com/u/50278200?v=4" } alt="Logo" width="100%" className="mx-auto block" preview/>
            }
        }else{                
            return (
                <div>
                    <Skeleton size="20vw" className="mx-auto mb-2"/>
                    {/* <Skeleton height="4vh" width="20vw" className="mx-auto mb-2"/>
                    <Skeleton height="2vh" width="20vw" className="mx-auto mb-2"/>
                    <Skeleton width="20vw" className="mx-auto"/> */}
                </div>
            )
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
                <a>Repositórios</a>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={getFilterValue} onChange={handleFilterChange} placeholder="Busca" />
                </span>
            </div>
        )
    }
    const header2 = renderHeader2();

    const footer = (
        <span>
            <Button label="Save" icon="pi pi-check" />
            <Button label="Cancel" icon="pi pi-times" className="p-button-secondary ml-2" />
        </span>
    );

    async function getUserData(){
        await api.get(`/users/${getUsername}`)
        .then(response => {
            setContentGithub(response.data);
            if(pathname.indexOf("") !== -1){
                setLoading(false);
            }
        })
        .catch(err => {final("error", "Erro!", err.response.data.message || "Não foi possivel retornar as informações do usuário. " + err); throw Error(err) })
    }
    
    async function getRepoData(){ 
        await api.get(`/users/${getUsername}/repos?per_page=100`)
        .then(response => {
            setContentApi(response.data);
        })
        .catch(err => {final("error", "Erro!", "Não foi possivel retornar as informações do usuário. " + err) })
    }
    
    function fetchData(event?:any){
        event?.preventDefault();
        setLoading(true);
        setContentApi(null);
        setContentGithub(null);
        setTimeout(() => {
            getUserData().then(() => getRepoData().then(() => setLoading(false)).catch(() => setLoading(false))).catch(() => setLoading(false));
        }, 500);
    }

    const renderFooter = () => {
        return (
            <div>
                {/* <Button label="Fechar" icon="pi pi-times" onClick={() => setShowRepoInfo(false)} className="p-button-text" /> */}
                {/* <Button label="Yes" icon="pi pi-check" onClick={() => onHide(name)} autoFocus /> */}
            </div>
        );
    }

    const moreColumnTemplate = (rowData:any) => {
        return <Button className="p-button-raised p-button-outlined lg:mx-auto lg:col-12 button-primary-hover" onClick={() => {setShowRepoInfo(true); setRepositoryName(rowData.name)}}>
            <AiOutlineEye className="mx-auto my-0 p-0" size={20}/>
        </Button>
    }

    const redirectLinkColumnTemplate = (rowData:any) => {
        return <Button className="p-button-raised p-button-outlined lg:mx-auto block lg:col-12 button-primary-hover" label={"Acessar " + rowData.name} onClick={() => {window.open(`${rowData.html_url}`, "_blank")}}/>
    }
        
    function final(type:any, title:any, message:any){
        setType(type);
        setTitle(title);
        setMessage(message);
        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3500);
    }
    
    return (
        <div className="">
            {getShow
                ?
                    <ToastComponent title={getTitle} message={getMessage} type={getType} />
                :<></>
            }
            {isHome
                ? <></>
                :
                    <form onSubmit={fetchData}>
                        <a className="text-color-inverted">Digite um usuário do GitHub para buscar:</a>
                        <div className="mt-2 p-inputgroup">
                            {/* <Button icon="pi pi-home" className="p-button-secondary p-button-outlined button-secondary-hover" type="button" onClick={() => {setUsername('gabrielrbernardi');fetchData();}}/> */}
                            <Button icon="pi pi-github" className="p-button-secondary" type="button"/>
                            <InputText value={getUsername} onChange={(e) => {setUsername(e.target.value)}} placeholder="Usuário"/>
                            <Button icon="pi pi-search" className="p-button-info" type="submit"/>
                        </div>
                    </form>
            }
            <div className="grid m-0 justify-content-center">
                <Card className="md:col-3 col-12 mt-2 p-0 align-self-start" style={{minWidth: "225px"}}>
                {/* <Card style={{ width: '25em' }} footer={footer} header={header}> */}
                    {getContentGithub || getContentApi
                        ?
                            <>
                                <div style={{maxWidth: "400px"}} className="sm:mx-auto my-0 p-0">
                                    {headerCard()}
                                </div>
                                {/* <p className="m-0" style={{lineHeight: '1.5'}}></p> */}
                                <br/>
                                <a className="text-4xl">{getContentGithub?.name}</a>
                                <br/>
                                <div className="button-demo my-2">
                                    <div className="template">
                                        <Button className="discord py-2" onClick={() => {window.open(getContentGithub.html_url, "_blank")} }>
                                            <i className="pi pi-github" style={{'fontSize': '1.5em'}}></i>
                                            <a className="ml-2">@{getContentGithub?.login}</a>
                                        </Button>
                                    </div>
                                </div>
                                {/* <a href={getContentGithub.html_url} target="_blank" className="text-xl text-link">@{getContentGithub?.login}</a> */}
                                <a className="text-lg">{getContentGithub?.bio}</a>
                                {getContentGithub.location
                                    ?
                                    <>
                                            <div className="mt-4">
                                                <GoLocation size={13}/>
                                                <a className="text-lg">  {getContentGithub?.location}</a>
                                            </div>
                                        </>
                                    :
                                        <></>
                                }
                            </>
                        :
                            <>
                                <Skeleton size="20vw" className="mx-auto mb-4"/>
                                <Skeleton height="4vh" className="mb-2"/>
                                <Skeleton height="2vh" className="mb-2"/>
                                <Skeleton />
                            </>
                    }
                </Card>
                {isHome
                    ?
                        <></>
                    :
                        <DataTable dataKey="id" value={getContentApi} paginator className="col-12 md:col-9 md:pl-4 mr-0 pl-0 pr-0" rows={10} rowsPerPageOptions={[5,10,25,50]} emptyMessage="Repositório inexistente." 
                            header={header2} filters={getFilter} loading={getLoading} showGridlines resizableColumns columnResizeMode="expand" removableSort>
                            <Column field="name" header="Nome" headerStyle={{ width: '3em' }} sortable></Column>
                            <Column field="created_at" header="Criado em" headerStyle={{ width: '3em' }} sortable></Column>
                            <Column field="language" header="Linguagem" headerStyle={{ width: '3em' }} sortable></Column>
                            <Column field="html_url" header="Detalhes" headerStyle={{ width: '1em' }} body={moreColumnTemplate}></Column>
                            <Column field="html_url" header="Acessar" headerStyle={{ width: '3em' }} body={redirectLinkColumnTemplate}></Column>
                        </DataTable>
                }
                <Dialog header={"Repositório: " + getRepositoryName} visible={getShowRepoInfo} style={{ width: '90vw' }} footer={renderFooter()} onHide={() => setShowRepoInfo(false)} draggable={false}>
                    <DataTableRepositories username={getUsername} repositoryName={getRepositoryName}/>
                </Dialog>
            </div>
        </div>
    );
}

export default About;