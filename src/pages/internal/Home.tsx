import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import InstructorsListLinks from '../../components/InstructorsListLinks';
import apiGrb from '../../services/apiGrb';
import Toast from '../../components/Toast';
import Clients from '../internal/Clients/Clients';
import Loading from '../../components/Loading';

const HomeInternal = (props:any) => {
    const [getAdminStatus, setAdminStatus] = useState<boolean>();
    const [getInstructorStatus, setInstructorStatus] = useState<boolean>(true);
    const [getOtherStatus, setOtherStatus] = useState<boolean>();
    const [getLoading, setLoading] = useState<boolean>();

    // useEffect(() => {
    //     checkAuth()
    //     // setInterval(() => {
    //     //     checkAuth()
    //     // }, 2000)

    // }, [document.cookie])
        
    async function checkAuth(){
        setLoading(true);
        let id_usuario = getCookie("id")
        await apiGrb.get(`/user/checkAdmin/${id_usuario}`)
        .then(async (response) => {
            if(response){
                setAdminStatus(response.data.isAdmin)
                if(response.data.isAdmin === false){
                    await apiGrb.get(`/user/checkInstructor/${id_usuario}`)
                    .then((res) => {
                        if(res){
                            setInstructorStatus(res.data.isInstructor)
                            if(res.data.isInstructor === false){
                                setOtherStatus(res.data.isInstructor)
                            }
                        }
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
                        //@ts-ignore
                        ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Erro ao buscar os valores"}/>);
                    })
                }
                setLoading(false);
            }
        }).catch(err => {
            setLoading(false);
            //@ts-ignore
            ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Erro ao buscar os valores"}/>);
        });
        return true
    }

    function getCookie(name:any) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';')?.shift();
    }

    return (
        <>
            {getLoading
                ? <Loading/> 
                : <></>
            }
            <div className="grid md:col-11 block mx-auto mt-2">
                {!getAdminStatus && !getInstructorStatus && getOtherStatus && <InstructorsListLinks/>}
                {/* {getInstructorStatus || getAdminStatus ?
                    <>
                        <div className="block text-center text-3xl mx-auto mb-2">Olá {getCookie("name") || ""}! Bem-vindo ao painel de controle da plataforma.</div>
                    </>
                    :<></>
                } */}
                {getInstructorStatus &&
                    <Clients/>
                    // <Accordion multiple activeIndex={[0]}>
                    //     <AccordionTab header="Clientes">
                    //         <>
                    //             <Clients/>
                    //         </>
                    //     </AccordionTab>
                    // </Accordion>
                }
            </div>
        </>
    );
}

export default HomeInternal;