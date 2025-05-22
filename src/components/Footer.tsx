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

const githubLink = "https://github.com/gabrielrbernardi"


const Footer = () => {
    const navigate = useNavigate();
    // const [value, setValue] = useState('');
    
    const bannerSource = (
        <>
            <a>Parâmetro de origem inválido</a>
        </>
    )

    return (
        // <div className="mx-3 text-center py-2 sticky bottom-0 border-1 border-100" style={{"backgroundColor": "rgba(30, 30, 30, 0.7)"}} style={{"backgroundColor": "var(--surface-card)" }}>
        <div className="mx-3 mb-4 text-center py-2 sticky bottom-0 border-1 border-100 surface-card border-round z-5">
            <div>
                <a className={"text-link-special-class"} onClick={() => {window.open(githubLink + "/ControlAccess", "_blank")}}>{"Control Access"}</a>
                <a className={"text-footer ml-4 text-primary"} onClick={() => {window.open(githubLink, "_blank")}}>
                    <text className="h5">Gabriel Bernardi</text>
                    <BsGithub className="ml-2 logo-middle" size={20}/>
                </a>
            </div>
        </div>
    );
}

export default Footer;