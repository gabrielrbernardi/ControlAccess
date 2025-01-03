import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useLocation } from 'react-router-dom';
import { Column } from 'primereact/column';
import Toast from '../components/Toast';
import ReactDOM from 'react-dom/client';
import api from '../services/apiGithub';
import apiGrb from '../services/apiGrb';
import { Skeleton } from 'primereact/skeleton';

const cicloAtual = "2022-3";

const DataTableRepositories = (props: any) => {
    var repositoryName = "";
    var username = "";
    var repositoryUrl = "";
    const [getRepositoryContent, setRepositoryContent] = useState<any>([]);
    const [getUsername, setUsername] = useState<any>("");
    const [getLoading, setLoading] = useState(true);   
    const [getActualCycle, setActualCycle] = useState<any>("");
    const [getRepositoryNameCustom, setRepositoryNameCustom] = useState<any>("");
    const [getRepoUrl, setRepoUrl] = useState<any>("");
    const [getRepoUrlGithub, setRepoUrlGithub] = useState<any>("");
    const [getPath, setPath] = useState(false);
    
    useEffect(() => {
        if(props.username){ username = props.username;}
        else{ username = "gabrielrbernardi"; }

        if(props.repositoryName){ repositoryName = props.repositoryName; }
        else{ repositoryName = "UberHub-Code-Club"; }
        
        setUsername(props?.usernameChoose || "");
        if(props.uhcc){ setPath(true); getRepositoryInfo(true); }else{
            getRepositoryInfo(false)
        }
        // if(props.uhcc){ setPath(true);  }
    },[])

    async function getConfigInfo(){
        setLoading(true)
        let username1 = (getUsername || props.usernameChoose || "");
        await apiGrb.get(`/config/username/${username1}`).then((response:any) => {
            if(response?.data?.configs){
                for(let x of response.data.configs){
                    if(x.ConfigName === "actualCycle"){
                        setActualCycle(x.ConfigValue)
                    }
                    if(x.ConfigName === "repositoryUrl"){
                        repositoryUrl = (x.ConfigValue);
                        setRepoUrl(x.ConfigValue)
                    }
                    if(x.ConfigName === "repositoryUrlGithub"){
                        setRepoUrlGithub(x.ConfigValue)
                    }
                    if(x.ConfigName === "repositoryNameCustom"){
                        setRepositoryNameCustom(x.ConfigValue);
                    }
                }
                setLoading(false)
                return repositoryUrl;
                // setActualCycle(response.data.configs[0].ConfigValue);
            }else{
                setActualCycle("")
                setLoading(false)
                return ""
            }
        }).catch(err => {
            let error = "";
            if(err?.request?.status === 404){
                error = "Erro na busca de configurações. Configurações não encontradas.";
            }else{
                error = "Erro na busca de configurações.";
            }
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={error || ""}/>)
            setLoading(false)
            return ""
        })
        setLoading(false)
        return repositoryUrl
    }

    async function getRepositoryInfo(uhcc:any){ 
        let repoUrl = ""
        if(uhcc){
            repoUrl = await getConfigInfo();
        }else{
            repoUrl = ""
        }
        if(uhcc){
            if(repoUrl){
                await api.get(repoUrl || `repos/${username}/${repositoryName}/contents`)
                // await api.get(repoUrl || "")
                .then(response => {
                    if(response){
                        if(repositoryName == "UberHub-Code-Club"){
                            let lista = response.data
                            lista = lista.reverse()
                            setRepositoryContent(lista)
                        }else{
                            setRepositoryContent(response.data)
                        }
                    }
                })
                .catch(err => {
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.message + ". GitHub API." || "Erro na busca do repositório! GitHub API."}/>)
                })
            }else{
                // //@ts-ignore
                // ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"warn"} title={"Alerta!"} message={"Repositório não fornecido. GitHub API."}/>)
                setRepositoryContent("")
            }
        }else{
            await api.get(`repos/${username}/${repositoryName}/contents`)
                // await api.get(repoUrl || "")
                .then(response => {
                    if(response){
                        if(repositoryName == "UberHub-Code-Club"){
                            let lista = response.data
                            lista = lista.reverse()
                            setRepositoryContent(lista)
                        }else{
                            setRepositoryContent(response.data)
                        }
                    }
                })
                .catch(err => {
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.message + ". GitHub API." || "Erro na busca do repositório! GitHub API."}/>)
                })
        }
        setLoading(false);
    }
    
    const nameRepoColumnTemplate = (rowData:any) => {
        if(rowData.type === "dir"){
            if(rowData.name === getActualCycle){
                return (<>
                    <a className="font-bold text-link-special" onClick={() => {window.open(`${rowData.html_url}`, "_blank")}}>{rowData.name}</a>
                    <Tag value={"Ciclo atual"} severity={"info"} className="ml-2"/>
                </>)
            }else{
                return <a className="font-bold text-link-special" onClick={() => {window.open(`${rowData.html_url}`, "_blank")}}>{rowData.name}</a>
            }
        }else{
            return <a className="text-link-special" onClick={() => {window.open(`${rowData.html_url}`, "_blank")}}>{rowData.name}</a>
        }
    }

    const sizeRepoColumnTemplate = (rowData:any) => {
        if(rowData.size === 0){
            return <a> - </a>
        }else{
            return <a>{rowData.size}</a>
        }
    }

    return (
        <>
            {/* {getPath
                ?
                    <p className="md:ml-4 text-lg">
                        Os códigos desenvolvidos durante as aulas estão disponíveis abaixo:
                    </p>
                : <></>
            } */}
            {props.usernameChoose || window.location.pathname == "/about"
                ? 
                <>
                    {getRepositoryContent ?
                        <>
                            {getPath === true
                                ?
                                !getLoading
                                ?
                                    <div>
                                        <a>Repositório disponível em: </a>
                                        <a className="text-link-special-class" onClick={() => {window.open(getRepoUrlGithub, "_blank")}}>{getRepositoryNameCustom || getRepoUrlGithub}</a>
                                        {/* <a className="text-link-special-class" onClick={() => {window.open("https://github.com/gabrielrbernardi/UberHub-Code-Club", "_blank")}}>{getRepositoryNameCustom}</a> */}
                                    </div>
                                :
                                <Skeleton width="50%" />
                                :<></>
                            }
                            <DataTable value={getRepositoryContent} className="col-12 md:col-12 md:pl-4 mr-0 pl-0 pr-0 mx-auto" emptyMessage="Repositório vazio." loading={getLoading}>
                                <Column field="name" header="Nome" headerStyle={{ width: '3em' }} body={nameRepoColumnTemplate} />
                                <Column field="type" header="Tipo" headerStyle={{ width: '3em' }} />
                                <Column field="size" header="Tamanho" headerStyle={{ width: '3em' }} body={sizeRepoColumnTemplate}/>
                            </DataTable>
                        </>
                        : <a className="text-link-special-class cursor-auto fadein animation-duration-400">Não há registros cadastrados</a>
                    }
                </>
                : <a className="text-link-special-class cursor-auto fadein animation-duration-400">Selecione um usuário.</a>
            }
        </>
    )
}

export default DataTableRepositories;