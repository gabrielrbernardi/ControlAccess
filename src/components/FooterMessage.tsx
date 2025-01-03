import React, { useState, useEffect, useRef } from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Image } from 'primereact/image';
import { Messages } from 'primereact/messages';
import { MdCompareArrows } from 'react-icons/md';
import { AiOutlineColumnWidth } from 'react-icons/ai';
import { GiTransform } from 'react-icons/gi';
import { Button } from 'primereact/button';

const logo = require("../assets/logo.png");

const rootPath = ""

const Footer = () => {
    const msgs3: any = useRef(null);

    useEffect(() => {
        msgs3.current.show({
            life: 10000, severity: 'info', sticky: false, closable: false, content: (
                <React.Fragment>
                    <div className="ml-2">O acesso à mini maratona já está disponível.</div>
                </React.Fragment>
            )
        });
    }, [])


    const navigate = useNavigate();
    // const [value, setValue] = useState('');
    
    const home = { icon: 'pi pi-home', command: () => {navigate(rootPath + "/")} }
    const end = <p className="logo m-0 p-0" onClick={() => navigate(rootPath + '/')}><Image src={logo} width="48vh" alt="Logo"/></p>

    return (
        <div className="mx-3 text-center py-2 sticky  border-100 border-round w-6 text-white" style={{"bottom": "30px", "left": "25%"}}>
            <Messages ref={msgs3} />
            {/* <div>
                os valores digitados vao aqui
            </div> */}
        </div>
        // <div className="fadeindown animation-duration-1000 animation-ease-in-out fixed mx-auto text-center mb-6 w-full bottom-0 left-0 bg-red-500">
        //     <div style={{"backgroundColor": "#FF0000"}}>
        //         TESTE DE MENSAGEM
        //     </div>
        // </div>
    );
}

export default Footer;