import React, { useState } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

const CheckLength = () => {
    const [getTextMaxLength, setTextMaxLength] = useState<number>();
    const [getInputText, setInputText] = useState<string>('');
    
    let maxSize:number = 1000000;
    let statusSize:string = '';
    let statusColor:string = '';

    // function handleSubmit(e: any){
    //     e.preventDefault();
    //     alert(1)
    // }

    function checkSize(){
        if((getTextMaxLength === 0) || (getTextMaxLength === undefined) || (getInputText.length <= getTextMaxLength)){
            statusSize = "DENTRO";
            statusColor = "text-cyan-300";
        }else if(getInputText.length > (getTextMaxLength || 0)){
            statusSize = "FORA";
            statusColor = "text-orange-300";
        }

        if(getInputText.length === 1){
            return (getInputText.length + " caractere");
        }else{
            return (getInputText.length + " caracteres");
        }
    }
   
    return (
        <div>
            {/* <form onSubmit={handleSubmit}> */}
                <p className="grid justify-content-center mx-auto mt-0 mb-4 text-4xl">Verificar tamanho</p>
                <div className="grid m-0 justify-content-center p-0">
                    <div className="md:col-6 col-12 p-0 mb-3">
                        <p className="text-center text-xl">Tamanho máximo</p>
                        <div className="p-inputgroup">
                            <InputNumber value={getTextMaxLength} onChange={(e) => setTextMaxLength(e.value || 0)} mode="decimal" useGrouping={false} placeholder="Tamanho máximo" min={0} max={maxSize} autoFocus/>
                            {/* <InputNumber className="col-12" value={getTextMaxLength} onValueChange={(e) => setTextMaxLength(e.value)} mode="decimal" useGrouping={false} placeholder="Tamanho máximo" min={0} max={100} /> */}
                            <Button icon="pi pi-times" className="p-button-danger" type="button" onClick={() => {setTextMaxLength(0)}}/>
                        </div>
                    </div>
                </div>
                <div className="grid m-0 justify-content-center p-0">
                    <div className="md:col-6 col-12 p-0 mb-3">
                        <p className="text-center text-xl">Entrada</p>
                        <InputTextarea rows={5} className="col-12" value={getInputText} onChange={(e) => {setInputText(e.target.value)}} placeholder="Texto 01"/>
                        <p className="text-center text-lg">Tamanho: {checkSize()}</p>
                        <p className="text-center">Tamanho máximo: {getTextMaxLength || maxSize}</p>
                        {getTextMaxLength
                            ?
                                <p className={"text-center transition-duration-500 " + statusColor}>Status: {statusSize} do permitido</p>
                            : <></>
                        }
                    </div>
                </div>
            {/* </form> */}
        </div>
    );
}

export default CheckLength;