import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Image } from 'primereact/image';
import { Message } from 'primereact/message';
import { MdCompareArrows } from 'react-icons/md';
import { AiOutlineColumnWidth } from 'react-icons/ai';
import { GiTransform } from 'react-icons/gi';
import { GrScorecard } from "react-icons/gr";
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Dialog } from 'primereact/dialog';
import Footer from './Footer';

// import logo from "../assets/logo.png";
// import logo from "../assets/uhcc/uhccLogo.png";

// const logo = require("../assets/logo.png");

const rootPath = ""

const Navbar = () => {
    const navigate = useNavigate();
    const [ getItemsBreadCrumb, setItemsBreadCrumb ] = useState<any>([]);
    const [ getHideBanner, setHideBanner ] = useState<boolean>(false);
    const [ getValidSource, setValidSource ] = useState<boolean>(true);
    const [ getShowDialogAbout, setShowDialogAbout ] = useState<boolean>(false);
    const [ queryParams ] = useSearchParams();
    const { pathname } = useLocation();
    // const [value, setValue] = useState('');

    useEffect(() => {
        function splitStringPathname(){
            let tempList:any = []
            let path = "";
            
            for(let x = 0; x < pathname.split("/").length; x++){
                if(pathname.split("/")[x] === ""){
                    continue;
                }
                if(pathname.split("/")[x] === "grb"){
                    continue;
                }
                path += "/" + pathname.split("/")[x];
                let tempPath = path;
                let obj = {"label": (pathname.split("/")[x].charAt(0).toUpperCase() + pathname.split("/")[x].slice(1)), command: () => {navigate(rootPath + `${tempPath}`)}};
                tempList.push(obj);
            }
            setItemsBreadCrumb(tempList)
        }
        // document.cookie = "isAuth=true; ";
        splitStringPathname();
        
        if(!document.cookie){
            const d = new Date();
            d.setTime(d.getTime() + (30*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = "banner=true; " + expires;
        }
        if(queryParams.get("source") === "uberhub"){
            navigate(rootPath + '/uberhub')
        }else if(queryParams.get("source") === "compare"){
            navigate(rootPath + '/functionalities/compare')
        }else if(queryParams.get("source") === "length"){
            navigate(rootPath + '/functionalities/length')
        }else if(queryParams.get("source") === "transform"){
            navigate(rootPath + '/functionalities/transform')
        }else if(queryParams.get("source") === "score"){
            navigate(rootPath + '/scoreboard')
        }else if(queryParams.get("options") == "restricted"){
            navigate(rootPath + '/uberhub?options=restricted')
        }
        else if(!queryParams.get("source")){
            setValidSource(true)
        }
        else{
            setValidSource(false)
            setTimeout(() => {
                setValidSource(true)
            }, 5000)
        }
    },[pathname, navigate, document.cookie])

    const restrictedMenuItem = () => {
        if(!checkCookie()){
            return {
                label: 'Área restrita',
                icon: 'pi pi-fw pi-lock',
                command: () => {
                    navigate(rootPath + '/internal')
                },
            }
        }else{
            return {
                label: '',
                icon: '',
                className: "hidden"
            }
            // return {}
        }        
    }

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            command: () => {
                navigate(rootPath + '/')
            },
        },
        {
            label: 'Sobre',
            icon: 'pi pi-fw pi-info-circle',
            command: () => {
                showDialog()
            },
        },
        restrictedMenuItem()

    ];

    function clearCookie(){
        const d = new Date();
        d.setTime(d.getTime() + (180*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = "banner=false; " + expires;
        setHideBanner(true);
    }

    function getCookie(name:any) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';')?.shift();
      }

    function handleLogout(){
        document.cookie = "isAuth=false; path=/; Secure"
        document.cookie = "name=; path=/; Secure"
        document.cookie = "id=; path=/; Secure"
        const d = new Date();
        // document.cookie = "name=false; path=/grb/internal"
        // document.cookie = "username=false; path=/grb/internal"
        // document.cookie = "active=false; path=/grb/internal"
        navigate("login")
    }

    function checkCookie(){
        return document.cookie.indexOf("isAuth=true") === -1;
    }

    function showDialog(){
        getShowDialogAbout === true ? setShowDialogAbout(false) : setShowDialogAbout(true);
    }

    const bannerUHCC = (
        <>
            <a>Acessar repositório de códigos do UberHub?</a>
            <Button className="ml-2 p-button-secondary p-button-raised" label="Acessar" onClick={() => {navigate(rootPath + '/uberhub'); clearCookie()}} />
            <Button className="ml-2 p-button-danger p-button-raised" label="Cancelar" onClick={() => {clearCookie()}} />
        </>
    )
    
    const bannerSource = (
        <>
            <a>Parâmetro de origem inválido</a>
            {/* <Button className="ml-2 p-button-secondary p-button-raised" label="Acessar" onClick={() => {navigate(rootPath + '/uberhub'); clearCookie()}} />
            <Button className="ml-2 p-button-danger p-button-raised" label="Cancelar" onClick={() => {clearCookie()}} /> */}
        </>
    )
    
    const home = { icon: 'pi pi-home', command: () => {navigate(rootPath + "/")} }
    const end = ( 
        <div className="inline-flex">
            {checkCookie() 
                ?
                    <>
                        <Button icon="pi pi-sign-in" className="p-button-rounded p-button-outlined mr-2" tooltip="Login" tooltipOptions={{position: 'left'}} aria-label="Submit" onClick={() => navigate("login")} />
                    </>
                :
                    <>
                        <Button icon="pi pi-sign-out" className="p-button-rounded p-button-outlined mr-2 p-button-danger" tooltip="Sair" tooltipOptions={{position: 'left'}} aria-label="Submit" onClick={handleLogout} />
                    </>
            }
            <div className="logo m-0 p-0 flex-1" onClick={() => navigate(rootPath + '/')}>
                <Image src="https://zenithinformatica.com.br/assets/images/logozenithfullico-transp-122x122.png" width="36vh" alt="Zenith Informatica"/>
            </div>
        </div>
    )

    return (
        <div className="navbar-component card mb-2 md:sticky md:top-0">
            {getValidSource
                ? <></>
                : 
                    <>
                        <Message severity="error" className="col-12" content={bannerSource}/>
                    </>
            }
            <Menubar model={items} end={end} className="border-none"/>
            <BreadCrumb model={getItemsBreadCrumb} home={home} />

            <Dialog header="Sobre" visible={getShowDialogAbout} breakpoints={{'960px': '75vw', '640px': '90vw'}} style={{ width: '50vw' }} onHide={() => setShowDialogAbout(false)}>
                <h3>
                    Application Infrastructure
                </h3>
                <p>
                    The Back-end of the application is stored in GitHub and running on render.com. Beside that, the Front-end is stored in GitHub and use GitHub Pages to run a deployable version of the code. Finally, the database is on MongoDB Cloud.
                </p>
                <h3>
                    Libraries and Frameworks
                </h3>
                <p>
                    This platform was built using MongoDB as Database, NodeJS on Back-end to serve the application and ReactJS on Front-end. Both Back-end and Front-end is using Typescript.
                </p>
                <p>
                    As style of this application, we used Primereact and custom CSS configs. Was also used Primeicons and React-icons for the icons on buttons and labels.
                </p>
                {/* <h3>
                    Version
                </h3>
                <p>
                    3.1.0 (a05ed5a) */}
                    {/* (Major version).(Minor version).(Revision number).(Build number) */}
                {/* </p> */}
                <Footer/>
            </Dialog>
        </div>
    );
}

export default Navbar;