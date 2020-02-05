import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Modal, message } from 'antd';
import { connect } from 'dva';
import md5 from 'blueimp-md5'
import {toDateTime, responseMsg, getObjStatus, getOrgStr} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const operStatusSelect =  [
  {key: 0, value: '启用'},
  {key: 1, value: '暂停'},
  {key: 9, value: '注销'}
]
const flagStatusSelect =  [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'}
]
const operTypeSelect =  [
  {key: 0, value: '系统'},
  {key: 1, value: '机构'},
  {key: 2, value: '门店'}
]
const namespace = 'oper';
@connect(({ oper, loading }) => ({
  result: oper.data,
  queryLoading: loading.effects['oper/search'],
}))
@Form.create()

export default class Item extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    pwdModalVisible: false,
    newpwd: '',
    newpwd2: '',
    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {}
    }
  };
 
  componentDidMount() {
    this.searchList()
  }

  /* 列表初始化 */
  searchList() {
    const { dispatch } = this.props;
    const { queryParam } = this.state
    dispatch({
      type: `${namespace}/search`,
      payload: queryParam
    });
  }

  /* 查询操作 */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    let oldQuery = this.state.queryParam
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      const values = {
        ...fieldsValue,
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          condition: values,
          pageNumber: 1
        })
      }, ()=>{this.searchList()});
    });
  };

  /* 查询条件重置 */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      queryParam: {
        pageNumber: 1,
        pageSize: 15,
        startDate: '',
        endDate: '',
        condition: {}
      }
    }, ()=>{this.searchList()});
  }
  
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className="search">
        <div className="kuai">
          <span className="span">操作员名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('operName')(<Input placeholder="请输入操作员名称" />)}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">手机号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('operMobile')(<Input placeholder="请输入手机号" />)}
          </FormItem>
        </div>

        <div className="btnkuai">
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }

 /* 删除操作 */
  handleDel = e => {
    const { dispatch } = this.props;

    let queryParam = {
      id: e.id
    }
    dispatch({
      type: `${namespace}/del`,
      payload: queryParam,
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            responseMsg(res)
            this.searchList()
          }else{
            responseMsg(res)
          }
        }
      }
    });
  };

  detailDrawer = (res='') =>{
    const { detailVisible } = this.state;
    this.setState({
      detailVisible: !detailVisible,
      detailData: !detailVisible ? res : ''
    })
  }

  editDrawer = (res='') =>{
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailData: !editVisible ? res : ''
    })
  }

  changePwdModal = (res) => {
    const { pwdModalVisible } = this.state
    this.setState({
      pwdModalVisible: !pwdModalVisible
    })

    if (!pwdModalVisible) {
      this.setState({
        detailData: res
      })
    }else{
      this.setState({
        detailData: '',
        newpwd: '',
        newpwd2: '',
      })
    }
  }

  changePwdValue = (val, type) => {
    if (type == 1) {
      this.setState({
        newpwd: val
      })
    }else{
      this.setState({
        newpwd2: val
      })
    }
  }

  changePwdSubmit = () => {
    const { newpwd, newpwd2, detailData } = this.state
    if (newpwd == '' || newpwd2 == '') {
      message.error('修改密码不可为空！')
      return;
    }
    if (newpwd != newpwd2) {
      message.error('两次密码输入不一致，请重新输入！')
      return;
    }

    const { dispatch } = this.props;
    const values = {
      id: detailData.id,
      operPwd: md5(md5(newpwd).toUpperCase()).toUpperCase(),
    };

    dispatch({
      type: `${namespace}/update`,
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
    });
  };

  render() {
    const {detailData, detailVisible, editVisible, queryParam, pwdModalVisible} = this.state

    const columns = [
      { title: '用户账号', width: 120, dataIndex: 'operNo', key: 'operNo' },
      { title: '用户名称', dataIndex: 'operName', key: 'operName' },
      { title: '手机号', width: 120, dataIndex: 'operMobile', key: 'operMobile' },
      { title: '归属', dataIndex: 'orgName', key: 'orgName' },
      { title: '角色', dataIndex: 'roleName', key: 'roleName' },
      { title: '状态', dataIndex: 'flagStatusText', key: 'flagStatusText' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 180,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.editDrawer(record) }}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => { this.changePwdModal(record) }}>修改密码</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={() => { this.handleDel(record) }}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    
    const {result, queryLoading} = this.props
    const listData = result ? result.data : {}
    const tablePagination = {
      total: listData.totalRow || 0,
      current: queryParam.pageNumber,
      pageSize: queryParam.pageSize,
      onChange: pageNumber => {
        this.setState({queryParam: Object.assign({}, queryParam, {pageNumber: pageNumber})}, this.searchList)
      }
    }

    let tableData = null
    let list = listData.list
    if (list) {
      tableData = list.map((item, idx) => {
        const {
          id,
          instMapId,
          instName,
          partnerMapIdP,
          partnerNameP,
          partnerMapId,
          partnerName,
          merMapIdP,
          merMapId,
          shopMapId,
          operName,
          operNo,
          operMobile,
          portalId,
          roleMapId,
          roleName,
          flagStatus,
          operPwd,
          operExp,
          operHead,
          operSex,
          operBirthday,
          operEmail,
          operLevel,
          operEmployeeno,
          operAuth,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          instMapId,
          instName,
          partnerMapIdP,
          partnerMapId,
          partnerName,
          merMapIdP,
          merMapId,
          shopMapId,
          operName,
          operNo,
          operMobile,
          portalId,
          roleMapId,
          roleName,
          orgName: getOrgStr(item),
          flagStatus,
          flagStatusText: getObjStatus(flagStatusSelect, flagStatus),
          operPwd,
          operExp,
          operHead,
          operSex,
          operBirthday,
          operEmail,
          operLevel,
          operEmployeeno,
          operAuth,
          timeUpdate: toDateTime(timeUpdate),
          timeCreate: toDateTime(timeCreate)
        }
      })
    }
    return (
      <div>
        <Row key={'a'} style={{marginBottom:'15px'}}>
          <Card className={styles.tableListForm}>
            <div>{this.renderSearchForm()}</div>
          </Card>
        </Row>
        <Card key={'b'}
          className={styles.tableListTitle}
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 操作员列表
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>添加</Button>}
        >
          <Table
            loading={queryLoading}
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{x: 1000}}
            pagination={tablePagination}
          />
        </Card>
        <Drawer
          title="详情"
          placement="right"
          width={'24%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

        <Drawer
          title= {detailData ? '编辑' : '添加'}
          placement="right"
          width={'40%'}
          destroyOnClose={true}
          onClose={this.editDrawer}
          visible={editVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <EditPage
            detailData={detailData}
            onClose={this.editDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.editDrawer()
              }
            }
          />
        </Drawer>

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
                onChange={(val)=>this.changePwdValue(val.target.value, 1)}
                //onPressEnter={() => this.changePwdSubmit()}
              />
            </FormItem>

            <FormItem label="再输一次">
              <Input
                type="password"
                onChange={(val)=>this.changePwdValue(val.target.value, 2)}
                //onPressEnter={() => this.changePwdSubmit()}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}