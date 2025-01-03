import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import UpdateUserPassword from '../InstructorsArea/UpdateUserPassword';
// import UpdateUserName from './Users/UpdateUserName';
// import UpdateUserStatus from './Users/UpdateUserStatus';
// import UpdateUserPassword from './Users/ResetUserPassword';
// import CreateNewUser from './Users/CreateNewUser';
// import DeleteUser from './Users/DeleteUser';
// import UpdateUserStatusAdmin from './Users/UpdateUserStatusAdmin';

const HomeUsersInstructors = () => {
    const [getLoading, setLoading] = useState(true);
    const [getEditableStatus, setEditableStatus] = useState('updatePassword');

    const statusPossibilitiesUpdate = [
        {label: 'Redefinir senha', value: "updatePassword"}
    ];

    // useEffect(() => {   
    //     fetchData();
    // }, []);


    // async function fetchData(){
    //     setLoading(true);
    //     // await apiGrb.get("users")
    //     // .then((response:any) => {
    //     //     setUsers(response.data.users);
    //     //     setLoading(false);
    //     // }).catch((err:any) => {
    //     //     setLoading(false);
    //     //     //@ts-ignore
    //     //     ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Toast type={"error"} title={"Erro!"} message={"Erro ao buscar os valores."}/>);
    //     // })
    // }
  
    return (
        <>
                <div className="mb-5">
                    <p className="my-2">Opções:</p>
                    <Dropdown className="col-12" disabled value={getEditableStatus} options={statusPossibilitiesUpdate} onChange={(e) => setEditableStatus(e.value)} optionLabel="label" placeholder="Selecione um tipo de gerenciamento" />
                </div>
                {getEditableStatus === "updatePassword" && <UpdateUserPassword/>}
        </>
    )
}

export default HomeUsersInstructors;