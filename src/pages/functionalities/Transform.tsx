import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';

const Transform = () => {
    const [getInputText, setInputText] = useState<string>('');
    const [getOutputText, setOutputText] = useState<string>('');
    const [getTransformType, setTransformType] = useState<any>("none");
    const [getTooltipContent, setTooltipContent] = useState<string>('Clique para copiar');
    const transformOptions = [
        {name: "Nenhum", value: "none"}, 
        {name: "MAIÚSCULO", value: "upper"}, 
        {name: "minúsculo", value: "lower"}
    ];

    function transformFunction(){
        if(getTransformType === "none"){
            setOutputText("");
        }else if(getTransformType === "upper"){
            setOutputText(getInputText.toUpperCase());
        }else if(getTransformType === "lower"){
            setOutputText(getInputText.toLowerCase());
        }
    }

    function handleTooltip(){
        setTooltipContent('Copiado!')
        setTimeout(() => {
            setTooltipContent('Clique para copiar')
        }, 3000)
    }

    return (
        <div className="grid m-0 justify-content-center p-0">
            <div className="md:col-6 col-12 p-0 mb-3">
                <p className="text-center text-xl">Entrada</p>
                <InputTextarea rows={5} className="col-12" value={getInputText} onChange={(e) => {setInputText(e.target.value); transformFunction()}} placeholder="Entrada" autoFocus/>
                <p className="text-center text-lg">Tipo de transformação</p>
                <SelectButton className="text-center" value={getTransformType} options={transformOptions} optionLabel="name" onChange={(e) => {setTransformType(e.value);}} unselectable={false}/>
                <div className="mt-3 text-center">
                    <Button label="Atualizar" className="mt-2 text-center" onClick={() => {transformFunction()}} />
                </div>
                {getTransformType !== "none"
                    ?
                        <div className="mt-3 text-center">
                            <p className="text-lg">Saída</p>
                            <InputTextarea rows={5} className="col-12" value={getOutputText} placeholder="Saída"/>
                            <Button label="Copiar" className="mt-2 text-center" onClick={() => {navigator.clipboard.writeText(getOutputText); handleTooltip()}} tooltip={getTooltipContent}/>
                        </div>
                    : <></>
                }
            </div>
        </div>
    );
}

export default Transform;