import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useSearchParams } from "react-router-dom";
import ReactDOM1 from 'react-dom/';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Skeleton } from 'primereact/skeleton';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import ExercisesUHCC from '../components/ExercisesUHCC';
import DataTableRepositories from '../components/DataTableRepositories';
import apiGrb from '../services/apiGrb';
import Toast from '../components/Toast';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView } from 'primereact/tabview';
import { TabPanel } from 'primereact/tabview';
import Loading from '../components/Loading';

// import getLinkData from '../assets/links.json'; //dev
const linkConfig = "https://raw.githubusercontent.com/gabrielrbernardi/grb/main/webserver/src/assets/links.json";
const errorDataAxiosJson = ["error", "Erro!", "Erro ao buscar configurações."]

const UHCC = () => {
    const [getLinkData, setLinkData] = useState<any>({actualCycle: "", actualClass: "", rootRepo: "", aula:[], inic1:[], inic2:[], inter1:[], inter2:[], avanc1:[], avanc2:[], nacional:[]});
    const [getLoading, setLoading] = useState(true);   
    const [getUserOptions, setUserOptions] = useState<any>();
    const [getUserName, setUserName] = useState<any>("");
    const [getSelectedLink, setSelectedLink] = useState<any>('');
    const [getSearchParams, setSearchParams] = useSearchParams();
    const [getProject, setProject] = useState<boolean>(false);

    const [activeIndex, setActiveIndex] = useState<any>([]);
    
    const levelPossibilities = [
        {label: 'Aula', value: "aula"},
        {label: 'Iniciante 1', value: "inic1"},
        {label: 'Iniciante 2', value: "inic2"},
        {label: 'Intermediário 1', value: "inter1"},
        {label: 'Intermediário 2', value: "inter2"},
        {label: 'Avançado 1', value: "avanc1"},
        {label: 'Avançado 2', value: "avanc2"},
        {label: 'Nacional', value: "nacional"},
    ];

    useEffect(() => {        
        setUserName({label: "Todos", value: ""})
        fetchUsers()
        
        if(getSearchParams.get("project") === "nacional"){
            setProject(true);
            fetchData(true, true)
        }else{
            setProject(false);
            fetchData(true, false)
        }
    }, [])
    
    const fetchUsers = async () => {
        setLoading(true);
        await apiGrb.get("/user/filtered")
        .then(response => {
            let list = [{}];
            list.pop();
            list.push({label: "Todos", value: ""});
            response.data.users.map((valor:any, id:any) => {
                list.push({label: valor.Name, value: valor.Username})
            })
            // @ts-ignore
            list.sort((a, b) => (a.value > b.value) ? 1 : -1)
            setUserOptions(list)
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={err?.response?.data?.error || "Erro na listagem de usuários!"}/>)
        });
    }

    async function fetchData(mode: any = false, project: boolean = false) {
        setLoading(true);

        if(mode !== true){
            console.log(getUserName)

            const d = new Date();
            d.setTime(d.getTime() + (30*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = `instructor=${getUserName};` + expires + ";path=/; SameSite=None; Secure";
            onClick(0);
        }else if(project){
            setUserName("gabriel");
        }else{
            setUserName(getCookie("instructor"))
        }

        let usuario = "";
        let cookieContent = getCookie("instructor");

        if(getUserName !== null && getUserName !== undefined && getUserName !== "null" && getUserName !== ""){
            usuario = getUserName;
        }else if(cookieContent !== null && cookieContent !== undefined && cookieContent !== "null"){
            usuario = cookieContent;
        }else{
            usuario = "";
        }

        //condicao para projeto do naca code club
        if(project === true){
            await apiGrb.get(`links/filtered/level/nacional`)
            .then((response) => {
                setLinkData(response.data.links); 
                setLoading(false);
                if(response?.data?.alert){
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type="warn" title="Alerta" message={response?.data?.alert || "Nível não encontrado."}/>);
                }
            })
            .catch((err) => {
                setLoading(false);
                setLinkData(err?.response?.data?.links || []);
                //@ts-ignore
                ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={errorDataAxiosJson[0]} title={errorDataAxiosJson[1]} message={err?.response?.data?.error || errorDataAxiosJson[2]}/>);
            });
        }else{
            await apiGrb.get(`links/filtered/${usuario}`)
            .then((response) => {
                setLinkData(response.data.links);
                setLoading(false);
                if(response?.data?.alert){
                    //@ts-ignore
                    ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type="warn" title="Alerta" message={response?.data?.alert || "Usuário não encontrado."}/>);
                }
            })
            .catch((err) => {
                setLoading(false);
                setLinkData(err?.response?.data?.links || []);
                //@ts-ignore
                ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={errorDataAxiosJson[0]} title={errorDataAxiosJson[1]} message={err?.response?.data?.error || errorDataAxiosJson[2]}/>);
            });
        }        
    }

    function getCookie(name:any) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {let res = parts.pop()?.split(';')?.shift(); return res;}else{return null}
    } 

    const onRowSelect = async (event:any) => {
        window.open(`${event.data.Link}`, "_blank");
        setTimeout(()=>{setSelectedLink('')}, 500)
    }

    function renderComponent(arrayComponent: any){
        if((!arrayComponent || arrayComponent.length == 0) && !getLoading){
            return(
                <>
                    <a className="text-link-special-class cursor-auto fadein animation-duration-400">Não há links cadastrados</a>
               </>
            );
        }
        if(getLoading){
            return (<div>
                <Skeleton className="mb-2" width='50%' />
                <Skeleton className="mb-2" width='50%' />
                <Skeleton className="mb-2" width='50%' />
                <Skeleton width='50%' />
            </div>)
        }else{
            return (
                <DataTable className='outline-none fadein animation-duration-400' value={arrayComponent} responsiveLayout="scroll" selectionMode="single" 
                    onRowSelect={onRowSelect} size="small" removableSort sortField="NameLink" sortOrder={1}
                    selection={getSelectedLink} onSelectionChange={e => setSelectedLink(e.value)}
                >
                    <Column field="NameLink" header="Nome" style={{width:'15%'}}></Column>
                    <Column field="Description" header="Descrição" className="text-overflow-ellipsis" style={{width:'30%'}}></Column>
                    <Column field="BadgeType" header="Status" body={statusBadgeTypeTemplate} style={{width:'20%'}}></Column>
                    {!getUserName && 
                        <Column field="UsernameCreation" header="Instrutor" body={UserLinkTemplate} style={{width:'35%'}}></Column>
                    }
                </DataTable>
            )
        }
    }

    function findValueInArray(x: any){
        if(x){
            return levelPossibilities.find((y:any) => {
                if(y.value === x){
                    return y.value;
                }else{
                    return "";
            }})?.label
        }
    }

    function renderComponents(){
        let componentsLabelList = []
        let componentsList = []

        for(let x in getLinkData){
            componentsLabelList.push(findValueInArray(x))
            componentsList.push(<TabPanel header={findValueInArray(x)}>{renderComponent(getLinkData[x])}</TabPanel>)
        }
        componentsList.shift()

        if(getProject){
            for(let i = 0; i < 6; i++){
                componentsList.shift()
            }
        }
        return (componentsList.map((chave:any) => chave))
    }

    const statusBadgeTypeTemplate = (rowData: any) => {
        if(rowData.Badge){
            return <Tag value={rowData.BadgeLabel} severity={rowData.BadgeType} className="ml-2"/>;
        }else{
            return <></>
        }
    }

    const UserLinkTemplate = (rowData: any) => {
        if(rowData.UsernameCreation === "admin") {
            rowData.UsernameCreation = "";
            return "Todos"
        }
        if(rowData.UsernameCreation){
            if(getUserOptions){
                return <>{getUserOptions?.find((x:any) => x.value == rowData.UsernameCreation).label}</>;
            }else{
                return <></>
            }
        }else{
            return <>Todos</>
        }
    }
    
    const onClick = (itemIndex:any) => {
        let _activeIndex:any = activeIndex ? [...activeIndex] : [];

        const index = _activeIndex.indexOf(itemIndex);
        _activeIndex.splice(index, 1);

        setActiveIndex(_activeIndex);
    }

    const rightContents = (
        <React.Fragment>
            <Button icon="pi pi-refresh" loading={getLoading} onClick={() => {fetchData(); fetchUsers()}} className="mr-2 p-button-sm" />
        </React.Fragment>
    );

    const onUserChange = (e: { label?: any, value: any }) => {
        setUserName(e.value);
    }
    
    const leftContents = (
        <React.Fragment>
            <div>
                <a>Instrutor:</a>
                <Dropdown className="col-12 w-full my-0 py-0" value={getUserName} options={getUserOptions} onHide={fetchData} onChange={e => {onUserChange(e)}} placeholder="Selecione o Instrutor" disabled={getLoading}/>
            </div>
        </React.Fragment>
    );

    return (
        <div className=" fadeinup animation-duration-500 animation-ease-out">
            {getLoading 
                ?
                    <Loading/>
                :
                    <></>
            }
            <Accordion className="">
                <AccordionTab header="Gerador de links Neps/Beecrowd">
                    <ExercisesUHCC/>
                </AccordionTab>
            </Accordion>

            <div className="my-2">
                <Toolbar className="sticky h-auto py-2 toolbar-uhcc z-3" left={leftContents} right={rightContents} />

                <Accordion multiple activeIndex={[0,1]}>
                    <AccordionTab header="Links">
                            {renderComponent(getLinkData.aula)}
                    </AccordionTab>
                    <AccordionTab header="Slides">
                        <TabView className="" scrollable activeIndex={0}>
                            {renderComponents()}
                        </TabView>
                    </AccordionTab>
                </Accordion>
            </div>

            {getUserName !== "" && 
                <Accordion multiple activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <AccordionTab header="Códigos">
                        <DataTableRepositories uhcc usernameChoose={getUserName}/>
                    </AccordionTab>
                </Accordion>
            }
        </div>
    )
}

export default UHCC;