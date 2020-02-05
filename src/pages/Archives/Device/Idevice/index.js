import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, getOrgData, getDevTypeData} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import DevTypeSelect from '@/components/TKDevTypeSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;
const deviceAttachSelect = [
  {key: 0, value: '自有'},
  {key: 1, value: '携机入网'}
]
const deviceStatusSelect =  [
  {key: 0, value: '正常状态'},
  {key: 1, value: '暂停状态'},
  {key: 2, value: '库存状态'},
  {key: 4, value: '报修状态'},
  {key: 5, value: '报废状态'},
  {key: 9, value: '注销状态'}
]
const namespace = 'idevice';
@connect(({ idevice, loading }) => ({
  result: idevice.data,
  loading: loading.effects['idevice/search'] ? true : false,
}))
@Form.create()

export default class Idevice extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,

    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {
        devbrandMapId: '',
        modelCode: '',
        partnerMapId: '',
        partnerMapIdP: '',
        instMapId: '',
      }
    }
  };

  componentDidMount() {
    this.searchList()
  }

  queryChange (key, val, falg = false) {
    let oldQuery = this.state.queryParam
    if(falg){
      oldQuery.pageNumber = 1
      oldQuery.condition[key] = val
      this.setState({queryParam: oldQuery})
    } else {
      let tmpObj = {pageNumber: 1}
      tmpObj[key] = val
      this.setState({queryParam: Object.assign({}, oldQuery, tmpObj)})
    }
  }

  
  //获取组织数据
  onChangeOrg = (data) => {
    let orgData = getOrgData(data)
    let oldQuery = this.state.queryParam
    oldQuery.pageNumber = 1
    oldQuery.condition['instMapId'] = orgData.instMapId
    oldQuery.condition['partnerMapId'] = orgData.partnerMapId
    oldQuery.condition['partnerMapIdP'] = orgData.partnerMapIdP
    this.setState({queryParam: oldQuery})
  }

  //获取品牌数据
  onChangeDevType = (data) => {
    let devData = getDevTypeData(data)
    let oldQuery = this.state.queryParam
    oldQuery.pageNumber = 1
    oldQuery.condition['devbrandMapId'] = devData.devbrandMapId
    oldQuery.condition['modelCode'] = devData.modelCode
    this.setState({queryParam: oldQuery})
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
      const { deviceSn } = fieldsValue
      oldQuery.pageNumber = 1
      oldQuery.condition['deviceSn'] = deviceSn
      this.setState({queryParam: oldQuery}, ()=>{this.searchList()});
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
          <span className="span">归属 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('orgData')(
              <OrgSelect
                placeholder='请选择归属'
                allData={true}
                onChange={(val) => this.onChangeOrg(val)}
              />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">型号/品牌 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('devData')(
              <DevTypeSelect
                placeholder='请选择品牌'
                allData={true}
                onChange={(val)=>this.onChangeDevType(val)}
              />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">设备序列号 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('deviceSn')(
              <Input placeholder='请输入设备序列号'/>
            )}
          </FormItem>
        </div>
        {/* <div className="kuai">
          <span className="span">安装商户 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merMapId')(
              <Input placeholder='请输入商户编号'/>
            )}
          </FormItem>
        </div> */}

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
  editDrawer = (res='') =>{
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailData: !editVisible ? res : ''
    })
  }

  //报修
  devRepair = (e) => {
    if (e.deviceStatus > 2 ) {
      responseMsg('当前状态不允许保修操作')
      return
    }
    const { dispatch } = this.props;
    let queryParam = {
      id: e.id,
      deviceStatus: 4
    }
    dispatch({
      type: `${namespace}/update`,
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
  }

  //报废
  devScrap = (e) => {
    if (e.deviceStatus != 4 ) {
      responseMsg('当前状态不允许报废操作')
      return
    }
    const { dispatch } = this.props;
    let queryParam = {
      id: e.id,
      deviceStatus: 5
    }
    dispatch({
      type: `${namespace}/update`,
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
  }

  //返库
  devReturn = (e) => {
    if (e.deviceStatus != 0 ) {
      responseMsg('当前正在【使用状态】不允许【返库】操作')
      return
    }
    const { dispatch } = this.props;
    let queryParam = {
      id: e.id,
      deviceStatus: 2
    }
    dispatch({
      type: `${namespace}/update`,
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
  }




  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '设备序列号', dataIndex: 'deviceSn', key: 'deviceSn' },
      { title: '品牌/型号', width: 120, dataIndex: 'devbrandName', key: 'devbrandName' },
      { title: '归属机构', dataIndex: 'instName', key: 'instName' },
      { title: '安装商户', dataIndex: 'merName', key: 'merName' },
      //{ title: '款台号', width: 120, dataIndex: 'casherNo', key: 'casherNo' },
      { title: '状态', width: 120, dataIndex: 'deviceStatusText', key: 'deviceStatusText' },
      { title: '操作',
        key: 'operation',
        width: 300,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            {/* <a onClick={()=>{this.editDrawer(record)}}>修改</a>
            <Divider type="vertical" /> */}
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.devRepair(record)}}>
              <a>报修</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.devScrap(record)}}>
              <a>报废</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.devReturn(record)}}>
              <a>返库</a>
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
          deviceSn,
          devbrandMapId,
          devbrandName,
          instName,
          partnerName,
          partnerNameP,
          merName,
          modelCode,
          deviceStatus,
          deviceAttach,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          devBatchId,
          deviceToken,
          casherNo,
          posMapId,
          shopMapId,
          posNo,
          merNo,
          merMapId,
          merMapIdP,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          deviceSn,
          devbrandMapId,
          devbrandName,
          devName: devbrandName + '( '+ modelCode +' )',
          instName,
          partnerName,
          partnerNameP,
          merName,
          modelCode,
          deviceStatus,
          deviceStatusText: getObjStatus(deviceStatusSelect, deviceStatus),
          deviceAttach,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          devBatchId,
          deviceToken,
          casherNo,
          posMapId,
          shopMapId,
          posNo,
          merNo,
          merMapId,
          merMapIdP,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate)
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 设备维护
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          //extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>导出</Button>}
        >
          <Table
            loading={loading}
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{x: 1200}}
            pagination={tablePagination}
          />
        </Card>
        <Drawer
          title="详情"
          placement="right"
          width={'30%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

        <Drawer
          title={detailData ? '编辑' : '添加'}
          placement="right"
          width={'30%'}
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
      </div>
    );
  }
}