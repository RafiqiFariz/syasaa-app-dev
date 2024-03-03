import { Button, Card, Form, Input } from 'antd';
import styles from './register.module.css';
import { IonItem } from '@ionic/react';
import { useState } from 'react';

export const RegisterPage = ()=>{
    const [form, setFrom] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    
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
        // setFrom(values)
      };
    return(
      <div className="container my-auto mt-5">
      <div className="row">
        <div className="col-lg-4 col-md-8 col-12 mx-auto">
          <div className="card z-index-0 fadeIn3 fadeInBottom">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-primary shadow-primary border-radius-lg py-3 pe-1 mt-3">
                <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Sign Up Syasa</h4> 
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onFinish}>
              <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-person-fill"></i>
                  </span>
                  <input name='username' value={form.username} onChange={handleChange} type="email" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
              </div>
              <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon2">
                      <i className="bi bi-person-lock"></i>
                  </span>
                  <input name='password' value={form.password} onChange={handleChange} type="password" className="form-control" placeholder="password" aria-label="Password" aria-describedby="basic-addon2"/>
              </div>
              <div className="input-group input-group-dynamic mb-4">
                  <span className="input-group-text" id="basic-addon3">
                    <i className="bi bi-key-fill"></i>
                  </span>
                  <input name='confirmPassword' value={form.confirmPassword} onChange={handleChange} type="password" className="form-control" placeholder="Confirm Password" aria-label="Confirm Password" aria-describedby="basic-addon3"/>
              </div>
                <div className="text-center">
                  <button type="submit" className="btn bg-primary w-100 my-4 mb-2 text-white">Sign up</button>
                </div>
                <p className="mt-4 text-sm text-center">
                   have an account?
                  <IonItem className="text-primary text-gradient font-weight-bold" routerLink="/login">Sign in</IonItem>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
  </div>
    )
}