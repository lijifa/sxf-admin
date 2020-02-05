import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage, setLocale, getLocale } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { responseMsg } from '@/utils/utils';
import xCookie from '@/utils/xCookie'
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import styles from './index.less';

const FormItem = Form.Item;
const userDetail = xCookie.get('userData') ? JSON.parse(xCookie.get('userData')) : { loginName: '' }

const namespace = 'oper';
const selectedLang = getLocale();
@connect(({ oper, loading }) => ({
  result: oper.data,
  dataLoading: loading.effects['oper/update'],
}))
export default class GlobalHeaderRight extends PureComponent {
  state = {
    pwdModalVisible: false,
    newPwd: '',
    newPwd2: ''
  }

  constructor(props) {
    super(props)
    
    //禁止未登陆用户访问主页
    if (userDetail.operName == '') {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return;
    }

  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  changeLang = (item) => {
    console.log('changeLang ===== item')
    console.log(item.key)
    setLocale(item.key, false);
    // const locale = getLocale();
    // if (!locale || locale === 'zh-CN') {
    //   setLocale('en-US');
    // } else {
    //   setLocale('zh-CN');
    // }
  };

  changePwdModal = () => {
    const { pwdModalVisible } = this.state
    this.setState({
      pwdModalVisible: !pwdModalVisible
    })
  }

  checkPwd = (val, type) => {
    if (type == 1) {
      this.setState({
        newPwd: val
      })
    }else{
      this.setState({
        newPwd2: val
      })
    }
  }

  changePwdSubmit = () => {
    const { dispatch } = this.props
    const { newPwd, newPwd2 } = this.state
    if (newPwd == '' || newPwd2 == '') {
      message.error('修改密码不可为空！')
      return;
    }
    if (newPwd != newPwd2) {
      message.error('两次密码输入不一致，请重新输入！')
      return;
    }

    let values = {
      operMapId: userDetail.id,
      loginPwd: newPwd
    }

    dispatch({
      type: `oper/update`,
      payload: values,
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            responseMsg(res)

            this.changePwdModal()
          }else{
            responseMsg(res)
          }
        }
      }
    })
  }

  confirmLogin = () => {
    if(this.state.password==userDetail.operName) {
      message.success('成功')
      this.closeLoginModalVisible()
      this.menuDrawer()
      this.setState({
        password: ''
      })
    } else {
      message.success('密码错误')
    }
  }

  render() {
    const {
      onMenuClick,
      theme,
    } = this.props;

    const {
      pwdModalVisible
    } = this.state;

    let userDetail = xCookie.get('userData') ? JSON.parse(xCookie.get('userData')) : { operName: '' }

    const headerImg = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    const userName = userDetail.operName
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="setting" onClick={this.changePwdModal}>
          <Icon type="setting" />
            修改密码 
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录 
        </Menu.Item>
      </Menu>
    );
    const languageLabels = [
      {
        'langCode': 'zh-CN',
        'langName': '简体中文',
        'icon': '',
        'id': 1
      },{
        'langCode': 'en-US',
        'langName': 'English',
        'icon': '',
        'id': 2
      },
    ]

    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={this.changeLang}>
        {languageLabels.map(locale => (
          <Menu.Item key={locale.langCode}>
            {/* <span role="img" aria-label={languageLabels[locale]}>
              {languageIcons[locale]}
            </span>{' '} */}
            {locale.langName}
          </Menu.Item>
        ))}
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>

        {userName ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={headerImg}
                alt="avatar"
              />
              <span className={styles.name}>{userName}</span>
            </span>
          </Dropdown>

        ) : (
            <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
          )}

          <Dropdown overlay={langMenu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Icon
                type="global"
                style={{fontSize: '24px'}}
                title={formatMessage({
                  id: 'navBar.lang',
                  defaultMessage: 'English',
                })}
              />
              {formatMessage({ id: 'navbar.lang', defaultMessage: 'English', })}
            </span>
          </Dropdown>
        <Modal
          title="修改密码"
          centered
          destroyOnClose={true}
          visible={pwdModalVisible}
          bodyStyle={{textAlign:'center'}}
          width={320}
          height={440}
          // footer={null}
          maskClosable={false}
          onCancel={()=>{this.changePwdModal()}}
          onOk={() => {this.changePwdSubmit()}}
        >
          <Form layout='inline'>
            <FormItem label="新的密码">
              <Input
                type="password"
                onChange={(val)=>this.checkPwd(val.target.value, 1)}
                onPressEnter={() => this.confirmLogin()}
              />
            </FormItem>

            <FormItem label="再输一次">
              <Input
                type="password"
                onChange={(val)=>this.checkPwd(val.target.value, 2)}
                onPressEnter={() => this.confirmLogin()}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
