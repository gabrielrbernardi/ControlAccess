import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { MdCompareArrows } from 'react-icons/md';
import { GiTransform } from 'react-icons/gi';
import { AiOutlineColumnWidth } from 'react-icons/ai';

const Functionalities = () => {
    const navigate = useNavigate();

    return (
        <div className="grid md:col-6 block mx-auto mt-2">
            <Accordion multiple activeIndex={[0,1,2]}>
                <AccordionTab header="Comparar">
                    <p>Ferramenta que torna capaz a comparação entre textos, indicando se os mesmos são iguais ou diferentes.</p>
                    <Button icon={<MdCompareArrows size={20} className="mr-2"/>} label="Comparar" onClick={() => navigate("compare")}/>
                </AccordionTab>
                <AccordionTab header="Tamanho">
                    <p>Com essa funcionalidade é possivel verificar o tamanho de textos, além de tornar possível verificar se o mesmo está dentro do limite de caracteres a ser definido pelo usuário.</p>
                    <Button icon={<AiOutlineColumnWidth size={20} className="mr-2"/>} label="Tamanho" onClick={() => navigate("length")}/>
                </AccordionTab>
                <AccordionTab header="Transformar">
                    <p>Esta ferramenta torna possível transformar textos inteiros para MAIÚSCULOS ou minúsculos, além de possibilitar a cópia do mesmo de forma simples e rápida.</p>
                        <Button icon={<GiTransform size={20} className="mr-2"/>} label="Transformar" onClick={() => navigate("transform")}/>
                </AccordionTab>
            </Accordion>
        </div>
    )
}

export default Functionalities;