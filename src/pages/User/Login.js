import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, message, Icon, Input } from 'antd';
import Particles from 'react-particles-js';
import md5 from 'blueimp-md5'
import Login from '@/components/Login';
import logoImg from '@/assets/logo.png';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          portalId:1,
          password: md5(values.password).toUpperCase(),
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    let wh = document.body.clientHeight
    return (
      <div className={styles.main}>
        <div style={{width:'450px', height:'350px', textAlign:'center', lineHeight:'350px', float:'left' }}>
          <img width='350px' src={logoImg} />
        </div>
        <div style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0,width: 'auto',height: 'auto'}}>
          <Particles params={{particles: {number: {value: 50},size: {value: 10},color: {value: '#ddd'},line_linked: {color: '#ddd',distance: 320}}}} height={wh} />
        </div>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName name="username" placeholder="请输入用户名" />
          <Password
            name="password"
            placeholder="请输入密码"
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
