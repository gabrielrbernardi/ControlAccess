import React, { useState } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { SelectButton } from 'primereact/selectbutton';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { FiSend } from 'react-icons/fi'

const uriPatternLink = "https://www.beecrowd.com.br/judge/pt/problems/view/"
const nepsPatternLink = "https://neps.academy/br/exercise/"

const ExercisesUHCC = () => {
    const [getExerciseNumber, setExerciseNumber] = useState(0);
    const [getPlatform, setPlatform] = useState<any>("none");
    
    const platformOptions = [
        {name: "URI/Beecrowd", value: "uri"}, 
        {name: "Neps", value: "neps"}
    ];

    function generateLink(){
        if(getPlatform === "uri"){
            return uriPatternLink + getExerciseNumber;
        }else if(getPlatform === "neps"){
            return nepsPatternLink + getExerciseNumber;
        }else{
            return "Plataforma não selecionada!";
        }
    }

    return (
        <div className="mx-auto text-center mb-4">
            <p className="text-center text-lg">Plataforma</p>
            <SelectButton className="text-center" value={getPlatform} options={platformOptions} optionLabel="name" onChange={(e) => {setPlatform(e.value)}} unselectable={false}/>
            {getPlatform === "uri" && <Message className="mt-2" severity="warn" text={`Para conseguir visualizar o exercício, é necessário que já esteja logado ao Beecrowd!`} />}
            {/* {getPlatform === "uri" && <div className="text-link-special-class-danger cursor-auto mt-2">Para conseguir visualizar o exercício, é necessário que já esteja conectado ao Beecrowd!</div>} */}
            <p>Digite o número do exercício: </p>
            <InputNumber value={getExerciseNumber} onChange={(e) => {setExerciseNumber(e.value || 0)}} mode="decimal" useGrouping={false} placeholder="Tamanho máximo" min={0} max={100000} autoFocus/>
            <br/>
            <Button className="mt-3" disabled={getExerciseNumber && getPlatform != "none" ? false : true} onClick={() => {window.open(generateLink(), "_blank")}}>Ir para plataforma<FiSend className='ml-2' /></Button>
        </div>
    )
}

export default ExercisesUHCC;