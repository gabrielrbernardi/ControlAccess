import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="grid m-0 justify-content-center">
            <Card className="md:col-3 col-8 mt-2 p-0 align-self-start" style={{minWidth: "225px"}}>
                <a className="text-6xl">404</a>
                <br/>
                <br/>
                <a className="text-3xl">Página não encontrada</a>
                <br/>
                <Button className="mt-4" label="Voltar para Home" onClick={() => {navigate('');}}/>
            </Card>
        </div>       
    )
}

export default NotFound;