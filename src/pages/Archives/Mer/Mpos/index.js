import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import styles from '../TableList.less';
import AddPage from './AddPage';
import EditPage from './EditPage';
import EditKeyPage from './EditKeyPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;

const namespace = 'merchantpos';

@connect(({ merchantpos, loading, paykey }) => ({
  result: merchantpos.data,
  detailRes: paykey.detailRes,
  loading: loading.effects['merchantpos/search'] ? true : false,
}))
@Form.create()

export default class Coin extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    editKeyVisible: false,
    addVisible: false,

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
      const {merName} = fieldsValue
      const values = {
        merName
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
          <span className="span">商户名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merName')(
              <Input placeholder='请输入商户名称' />
            )}
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

  //详情
  detailDrawer = (res='') =>{
    const { detailVisible } = this.state;
    this.setState({
      detailVisible: !detailVisible,
      detailData: !detailVisible ? res : ''
    })
  }  
  
  //编辑
  addDrawer = (res='') =>{
    const { addVisible } = this.state;
    this.setState({
      addVisible: !addVisible,
      detailData: !addVisible ? res : ''
    })
  }

  //editKeyDrawer
  editKeyDrawer = (res='') =>{
    const { editKeyVisible } = this.state;
    if(!editKeyVisible){
      const { dispatch } = this.props;
      dispatch({
        type: `paykey/detail`,
        payload: {
          instMapId: res.instMapId,
          hostMapId: 0,
          keyIndex: res.keyIndex
        }
      }).then(()=>{
        let keydata = this.props.detailRes
        
        this.setState(
          {
            editKeyVisible: !editKeyVisible,
            detailData: keydata
          }
        )
      });
    }else{
      this.setState(
        {
          editKeyVisible: !editKeyVisible,
          detailData: ''
        }
      )
    }
  }

  //编辑
  editDrawer = (res='') =>{
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailData: !editVisible ? res : ''
    })
  }
  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '商户编号', width: 120, dataIndex: 'merNo', key: 'merNo' },
      { title: '商户名称', width: 120, dataIndex: 'merName', key: 'merName' },
      { title: '终端号', width: 100, dataIndex: 'posNo', key: 'posNo' },
      { title: '批次号', width: 80, dataIndex: 'posBatch', key: 'posBatch' },
      { title: '流水号', width: 80, dataIndex: 'posTrace', key: 'posTrace' },
      { title: '申请订单号', dataIndex: 'posapplyOrderNo', key: 'posapplyOrderNo' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 220,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editDrawer(record)}}>修改</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editKeyDrawer(record)}}>密钥管理</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleDel(record)}}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const {result, loading} = this.props
    const listData = result.data || {}
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
          posMapId,
          posapplyOrderNo,
          instMapId,
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merName,
          merNo,
          posNo,
          posStatus,
          posReportStatus,
          posBatch,
          posTrace,
          posPbockeyflag,
          posPbocparaflag,
          posParaflag,
          posProgflag,
          posCurprogver,
          posNewprogver,
          posHmdflag,
          posTimeout,
          posMaxamt,
          posMaxcnt,
          posCardflag,
          posPinflag,
          posCommRetry,
          posConfirmMode,
          posTransDefault,
          posTip,
          posTipPer,
          posManMode,
          posTransRetry,
          posMaxrefundamt,
          posEchotime,
          posLogout,
          posTicketnums,
          comIndex,
          keyIndex,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          posMapId,
          posapplyOrderNo,
          instMapId,
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merName,
          merNo,
          posNo,
          posStatus,
          posReportStatus,
          posBatch,
          posTrace,
          posPbockeyflag,
          posPbocparaflag,
          posParaflag,
          posProgflag,
          posCurprogver,
          posNewprogver,
          posHmdflag,
          posTimeout,
          posMaxamt,
          posMaxcnt,
          posCardflag,
          posPinflag,
          posCommRetry,
          posConfirmMode,
          posTransDefault,
          posTip,
          posTipPer,
          posManMode,
          posTransRetry,
          posMaxrefundamt,
          posEchotime,
          posLogout,
          posTicketnums,
          comIndex,
          keyIndex,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
        }
      })
    }
    return (
      <div>
        <Row style={{marginBottom:'15px'}}>
          <Card key={'a'} className={styles.tableListForm}>
            <div>{this.renderSearchForm()}</div>
          </Card>
        </Row>
        <Card key={'b'}
          className={styles.tableListTitle}
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 商户终端管理
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.addDrawer()}}>申请终端</Button>}
        >
          <Table
            loading={loading}
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{x: 800}}
            pagination={tablePagination}
          />
        </Card>
        <Drawer
          title="详情"
          placement="right"
          width={'50%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>
        <Drawer
          title={'申请终端'}
          placement="right"
          width={'30%'}
          destroyOnClose={true}
          onClose={this.addDrawer}
          visible={this.state.addVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <AddPage
            detailData={detailData}
            onClose={this.addDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.addDrawer()
              }
            }
          />
        </Drawer>
        <Drawer
          title={'编辑'}
          placement="right"
          width={'60%'}
          destroyOnClose={true}
          onClose={this.editDrawer}
          visible={this.state.editVisible}
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
        <Drawer
          title={'编辑密钥'}
          placement="right"
          width={'40%'}
          destroyOnClose={true}
          onClose={this.editKeyDrawer}
          visible={this.state.editKeyVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <EditKeyPage
            detailData={detailData}
            onClose={this.editKeyDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.editKeyDrawer()
              }
            }
          />
        </Drawer>
      </div>
    );
  }
}