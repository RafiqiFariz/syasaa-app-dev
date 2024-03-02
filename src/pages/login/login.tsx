import { Button, Card, Checkbox, Form, Input } from "antd"
import styles from './login.module.css'
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { IonItem } from "@ionic/react"
export const LoginPage = ()=>{
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
      };
    return (
        <div className={styles.layout}>
             <Card className={styles.card}>
             <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                >
                <Form.Item
                    className="text-primary"
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input prefix={<i className="bi bi-person-fill" style={{color:'grey'}}></i>} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input
                    prefix={<i className="bi bi-lock-fill" style={{color:'grey'}}></i>}
                    type="password"
                    placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <div className="d-flex justify-content-between">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="">
                            Forgot password
                        </a>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div className="d-flex flex-column">
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        <div>
                            <IonItem routerLink="/register" routerDirection="forward">
                                <span className="text-primary">Or register now!</span>
                            </IonItem>
                        </div>
                    </div>
                </Form.Item>
                </Form>
            </Card>
        </div>
    )
}