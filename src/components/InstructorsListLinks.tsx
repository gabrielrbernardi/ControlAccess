import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import apiGrb from '../services/apiGrb';
import { render } from '@testing-library/react';
import Toast from './Toast';
import Loading from './Loading';

const RestrictedContents = (props: any) => {
    const [getInstructor, setInstructor] = useState<any>();
    const [getInstructorOptions, setInstructorOptions] = useState<any>([])
    const [getFiles, setFiles] = useState<any>({})
    const [getValues, setValues] = useState<any>([])
    const [getLoading, setLoading] = useState<any>(false)


    useEffect(() => {
        fetchInstructorsData()

    }, [])

    function submitForm(event?:any){
        event?.preventDefault();
        setValues(getFiles)
    }

    const fetchInstructorsData = async () => {
        setLoading(true)
        await apiGrb.get("instructors/filtered",)
            .then(response => {
                setInstructorOptions(response.data.instructors)
                setFiles(response.data.instructors)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                render(<Toast type={"error"} title={"Error"} message={err?.message + " " + err?.response?.status || "Error"}/>)
            })
    }

    function renderComponent(arrayComponent: any){
        return (
            arrayComponent.map( (value:any, id: any) => {
                if(value.Name.toLowerCase().includes(getInstructor?.Name)){
                    return (
                        <tr className="mt-1">
                            <td key={id} className="text-link-special-class" onClick={() => {window.open(`${value.Url}`, "_blank")}}>{value.Name + " - " + value.Description}</td>
                        {/* <Tag value={value.badgeLabel} severity={value.badgeType} className="ml-2"/> */}
                        </tr>
                    )
                }
            })
        )
    }


    return (<>
        {getLoading
            ? <><Loading/></>
            : <></>
        }
        <h2>Lista de usuários para minimaratona</h2>
        <form onSubmit={submitForm} className="mb-3">
            <a>Selecione o instrutor:</a>
            <div className="mt-2 p-inputgroup col-12 pl-0">
                <Button icon="pi pi-refresh" className="p-button-secondary" type="button" onClick={fetchInstructorsData} loading={getLoading}/>
                <Dropdown optionLabel="Name" value={getInstructor} options={getInstructorOptions} filter onChange={(e) => {setInstructor(e.value); submitForm()}} placeholder="Selecione o instrutor"/>
            </div>
            {renderComponent(getValues)}
        </form>
    </>)
}

export default RestrictedContents;