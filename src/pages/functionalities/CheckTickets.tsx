import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';


const CheckTickets = () => {
    const [getText01, setText01] = useState<any>('');
    const [getText02, setText02] = useState<any>('');
    const [getStatusCompare, setStatusCompare] = useState<any>('');

    function handleSubmit(event: any){
        event?.preventDefault();
        if(getText01 === getText02){
            setStatusCompare("Textos Iguais")
        }else{
            setStatusCompare("Textos Diferentes")
        }
    }

    function handleClear(){
        setText01('');
        setText02('');
        setStatusCompare('');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p className="grid justify-content-center mx-auto mt-0 mb-4 text-4xl">Conferir Tickets</p>
                <div className="grid m-0 justify-content-center">
                    {/* <Chips/> */}
                    <br/>
                    <div className="md:col-5 col-12 md:mr-3 md:mb-0 p-0 mb-3">
                        <p className="text-center">Texto 01</p>
                        <InputTextarea rows={5} className="col-12" value={getText01} onChange={(e) => {setText01(e.target.value)}} placeholder="Texto 01" autoFocus/>
                    </div>
                    <div className="md:col-5 col-12 md:mb-0 p-0">
                        <p className="text-center">Texto 02</p>
                        <InputTextarea rows={5} className="col-12" value={getText02} onChange={(e) => {setText02(e.target.value)}} placeholder="Texto 02"/>
                    </div>
                    <br/>
                </div>
                <div className="grid justify-content-center mt-4 mx-0">
                    <Button type="submit" label="Comparar" className="md:mr-3 mr-0 md:mb-0 mb-2 md:col-2 col-12 p-button-primary" />
                    <Button type="button" label="Limpar" className="md:col-2 col-12 p-button-secondary" onClick={handleClear}/>
                </div>
                {getStatusCompare
                    ? <p className="text-center">{getStatusCompare}</p>
                    : <></>
                }
            </form>
        </div>
    )
}

export default CheckTickets;