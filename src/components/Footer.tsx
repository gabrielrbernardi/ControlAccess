import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Image } from 'primereact/image';
import { Message } from 'primereact/message';
import { MdCompareArrows } from 'react-icons/md';
import { AiOutlineColumnWidth, AiOutlineGithub } from 'react-icons/ai';
import { BsGithub } from 'react-icons/bs';
import { GiTransform } from 'react-icons/gi';
import { Button } from 'primereact/button';

const logo = require("../assets/logo.png");

const githubLink = "https://github.com/gabrielrbernardi"


const Footer = () => {
    const navigate = useNavigate();
    // const [value, setValue] = useState('');
    
    const bannerSource = (
        <>
            <a>Parâmetro de origem inválido</a>
            {/* <Button className="ml-2 p-button-secondary p-button-raised" label="Acessar" onClick={() => {navigate(rootPath + '/uberhub'); clearCookie()}} />
            <Button className="ml-2 p-button-danger p-button-raised" label="Cancelar" onClick={() => {clearCookie()}} /> */}
        </>
    )

    return (
        // <div className="mx-3 text-center py-2 sticky bottom-0 border-1 border-100" style={{"backgroundColor": "rgba(30, 30, 30, 0.7)"}} style={{"backgroundColor": "var(--surface-card)" }}>
        <div className="mx-3 mb-4 text-center py-2 sticky bottom-0 border-1 border-100 surface-card border-round z-5">
            <div>
                <a className={"text-link-special-class"} onClick={() => {window.open(githubLink + "/grb", "_blank")}}>{"Repositório GRB"}</a>
                <a className={"text-footer ml-4 text-primary"} onClick={() => {window.open(githubLink, "_blank")}}>
                    <text className="h5">Gabriel Bernardi</text>
                    <BsGithub className="ml-2 logo-middle" size={20}/>
                </a>
            </div>
        </div>
        // <div className="fadeindown animation-duration-1000 animation-ease-in-out fixed mx-auto text-center mb-3 w-full bottom-0 left-0 bg-red-500">
        //     <div style={{"backgroundColor": "#FF0000"}}>
        //         TESTE DE MENSAGEM
        //     </div>
        // </div>
    );
}

export default Footer;