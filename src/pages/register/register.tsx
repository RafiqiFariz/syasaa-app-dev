import { Button, Card, Form, Input } from 'antd';
import styles from './register.module.css';

export const RegisterPage = ()=>{
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
      };
    return(
        <div className={styles.layout}>
             <Card className={styles.card}>
             <Form
                name="normal_register"
                className="login-register"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                              type: 'email',
                              message: 'The input is not valid E-mail!',
                            },
                            {
                              required: true,
                              message: 'Please input your E-mail!',
                            },
                          ]}
                    >
                        <Input prefix={<i className="bi bi-person-fill" style={{color:'grey'}}></i>} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                        prefix={<i className="bi bi-file-lock-fill" style={{color:'grey'}}></i>}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        rules={[
                            {
                              required: true,
                              message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
                              },
                            }),
                          ]}
                    >
                        <Input
                        prefix={<i className="bi bi-lock-fill" style={{color:'grey'}}></i>}
                        type="password"
                        placeholder="confirm password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <div className="d-flex flex-column">
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Register
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}