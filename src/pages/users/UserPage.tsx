import { useEffect, useState } from "react";
import { UserLayout } from "../../public/Layout/Layout";
import { useHistory } from "react-router";
import Cookies from "js-cookie";

interface userData{
    id: number,
    name: string,
    email: string,
    phone: string | null,
    roleId: number,
}

interface RoleData{
    id: number,
    name: string,
}

export const UserPage = () => {
    const history = useHistory()
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '').id : {}
    console.log(userId, 'userName')
    const [userData, setUserData] = useState<Array<userData>>([]);
    const [roles, setRoles] = useState<Array<RoleData>>([]);
    const getUserData = async () => {
        try{
            const response = await fetch('http://localhost:8000/api/v1/users', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            console.log(data, 'data')
            if(data){
                setUserData(data.data)
            }
        }catch(error){
            console.log(error, 'error')
        }
    }
    const getRoles = async () => {
        try{
            const response = await fetch('http://localhost:8000/api/v1/roles', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json()
            if(data){
                setRoles(data.data)
            }
            console.log(data, 'dataRoles')
        }catch(error){
            console.log(error, 'error')
        }
    
    }
    useEffect(()=>{
        getRoles()
    },[])
    useEffect(()=>{
        getUserData()
    },[])
    const columns = [
        {
            name: 'Name',
            selector: 'name',
            key: 1
        },
        {
            name: 'Email',
            selector: 'email',
            key: 2
        },
        {
            name: 'Phone',
            selector: 'phone',
            key: 3
        },
        {
            name: 'Role',
            selector: 'role_id',
            key: 4
        },
        {
            name: 'Action',
            selector: 'action',
        }
    ]
    const DeleteUserData = async (id: number) => {
        try{
            const response = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') || '',
                }
            })
            const data = await response.json()
            if(data){
                getUserData()
            }
        }catch(error){
            console.log(error, 'error')
        }
    }
    return(
       <UserLayout>
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card"
                        style={{
                            height: '85vh'
                        }}
                        >
                            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                                    <h6 className="text-white text-capitalize ps-3 d-flex align-items-center">Users</h6>
                                    <button className="btn btn-info btn-md mx-4"
                                    onClick={()=>{
                                        history.push(`/users/add`)
                                    }}
                                    >Add User</button>
                                </div>
                            </div>
                            <div className="card-body px-0 pb-2"
                            style={{
                                overflowY: 'auto',
                                maxHeight: 'max-content',
                            }}
                            >
                                <div className="table-responsive p-0">
                                    <table className="table align-items-center mb-0">
                                    <thead>
                                        <tr>
                                            {
                                                columns.map((item) => {
                                                    return (
                                                        <th key={item.key} className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">{item.name}</th>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </thead>
                                        <tbody>
                                            {
                                               userData.map((item,index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="d-flex px-2 py-1">
                                                            <div>
                                                                {/* <img src="../assets/img/team-2.jpg" className="avatar avatar-sm me-3 border-radius-lg" alt="user1"> */}
                                                            </div>
                                                            <div className="d-flex flex-column justify-content-center">
                                                                <h6 className="mb-0 text-sm">{item.name}</h6>
                                                            </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className="text-xs font-weight-bold mb-0">{item.email}</p>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <p className="text-xs font-weight-bold mb-0">{item.phone ?? '-'}</p>
                                                        </td>
                                                        <td className="align-middle">
                                                            <span className="text-secondary text-xs font-weight-bold">{roles.filter((role)=>role.id == item.roleId)[0]?.name ?? '-'}</span>
                                                        </td>
                                                        <td className="align-middle">
                                                            <button className="btn btn-primary btn-sm mx-1" disabled={userId === item.id ? true : false}
                                                            onClick={()=>{
                                                                history.push(`/users/edit/${item.id}`)
                                                            }}
                                                            >Edit</button>
                                                            <button className="btn btn-danger btn-sm"
                                                            disabled={userId === item.id ? true : false}
                                                            onClick={()=>DeleteUserData(item.id)}
                                                            >Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                               })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </UserLayout>
    )
};