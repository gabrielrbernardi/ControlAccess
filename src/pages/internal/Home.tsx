import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
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