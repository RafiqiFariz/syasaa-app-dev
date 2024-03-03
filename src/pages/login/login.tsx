import { Button, Card, Checkbox, Form, Input } from "antd"
import styles from './login.module.css'
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { IonItem } from "@ionic/react"
import { useState } from "react"
export const LoginPage = ()=>{
    const [form, setFrom] = useState({
        username: '',
        password: '',

    
    })
    const handleChange = (event: any) => {
        const {name, value} = event.target
        console.log(event.target.name)
        setFrom({
            ...form,
            [name]: value
        })
    }
    const onFinish = (event: any) => {
        event.preventDefault()
        console.log('Received values of form: ', form);
      };
    return (
    <div className="container my-auto mt-5">
        <div className="row">
          <div className="col-lg-4 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1 mt-3">
                  <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Absensi Syasa</h4> 
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={onFinish}>
                <div className="input-group input-group-dynamic mb-4">
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-person-fill"></i>
                    </span>
                    <input name="username" value={form.username} onChange={handleChange} type="email" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
                </div>
                <div className="input-group input-group-dynamic mb-4">
                    <span className="input-group-text" id="basic-addon2">
                        <i className="bi bi-person-lock"></i>
                    </span>
                    <input name="password" value={form.password} onChange={handleChange} type="password" className="form-control" placeholder="password" aria-label="Password" aria-describedby="basic-addon2"/>
                </div>
                  <div className="form-check form-switch d-flex align-items-center mb-3">
                    <input className="form-check-input" type="checkbox" id="rememberMe"/>
                    <label className="form-check-label mb-0 ms-3" >Remember me</label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn bg-primary w-100 my-4 mb-2 text-white">Sign in</button>
                  </div>
                  <p className="mt-4 text-sm text-center">
                    Don't have an account?
                    <IonItem className="text-primary text-gradient font-weight-bold" routerLink="/register">Sign up</IonItem>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
    )
}