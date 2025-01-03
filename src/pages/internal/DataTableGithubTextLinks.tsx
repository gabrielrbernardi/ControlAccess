import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import api from '../../services/apiGithub';

const DataTableGithubTextLinks = () => {
    const [getTextLinks, setTextLinks] = useState();
    const [getSelectedLink, setSelectedLink] = useState<any>();

    useEffect(() => {
        getGithubDataTextLinks()
    }, [])
    
    async function getGithubDataTextLinks(){
        api.get(`repos/gabrielrbernardi/grb/contents/webserver/src/assets/textFiles`).then((response: any) =>{
            setTextLinks(response.data)
        })
    }

    const onRowSelect = (event:any) => {
        window.open(`${event.data.download_url}`, "_blank");
        setTimeout(()=>{setSelectedLink("")}, 500)
    }

    const nameTemplate = (rowData: any) => {
        let tempString = rowData.name;
        tempString = tempString.replace(" demais", " geral")
        tempString = tempString.replace(".txt", "")
        return <a className="capitalize">{"Turma(s) " + tempString}</a>
    }

    return (
        <>
            <div className="grid">
                <div className="col">
                    <div className="text-center font-bold">Horários Previstos</div>
                    <div className="grid">
                        <div className="col">
                            <p className="my-0 py-0">Manhã:</p>
                            <p className="my-0 py-0">09:00h - 09:30h: Orientações gerais</p>
                            <p className="my-0 py-0">09:30h - 11:30h: Horário previsto para a maratona</p>
                            <p className="my-0 py-0 font-bold">Placar congelado nos últimos 20 minutos da competição</p>
                            <p className="my-0 py-0">11:30h - 12:00h: Premiação e considerações finais</p>
                        </div>
                        <div className="col">
                            <p className="my-0 py-0">Tarde:</p>
                            <p className="my-0 py-0">14:00h - 14:30h: Orientações gerais</p>
                            <p className="my-0 py-0">14:30h - 16:30h: Horário previsto para a maratona</p>
                            <p className="my-0 py-0 font-bold">Placar congelado nos últimos 20 minutos da competição</p>
                            <p className="my-0 py-0">16:30h - 17:00h: Premiação e considerações finais</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="text-center font-bold">Links BOCA</div>
                    <div className="grid">
                        <div className="col">
                            <a className="my-0 py-0 text-link-special-class" onClick={() => window.open(`${"https://boca.facom.ufu.br"}`, "_blank")}>BOCA Iniciante 1</a>
                            <p className="my-0 py-0">Mini Maratona UberHub Code Club Manha Inic 1</p>
                            <p className="my-0 py-0">Mini Maratona UberHub Code Club Tarde Inic 1</p>
                        </div>
                        <div className="col">
                            <a className="my-0 py-0 text-link-special-class" onClick={() => window.open(`${"https://maratona.facom.ufu.br"}`, "_blank")}>BOCA demais níveis</a>
                            <p className="my-0 py-0">Mini Maratona UberHub Code Club Manha Geral</p>
                            <p className="my-0 py-0">Mini Maratona UberHub Code Club Tarde Geral</p>
                        </div>
                    </div>
                </div>
            </div>
            <a>Clique nas turmas abaixo para abrir o arquivo com os usuários</a>
            <DataTable value={getTextLinks} selectionMode="single" sortField="name" removableSort sortOrder={1} onRowSelect={onRowSelect} selection={getSelectedLink} onSelectionChange={e => setSelectedLink(e.value)}>
                <Column field="name" header="Nome" body={nameTemplate}></Column>
            </DataTable>
        </>
    )
}

export default DataTableGithubTextLinks;
