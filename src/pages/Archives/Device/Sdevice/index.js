import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, getOrgData, getDevTypeData} from '@/utils/utils';
import OrgSelect from '@/components/TKOrgSelect';
import DevTypeSelect from '@/components/TKDevTypeSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import SetupPage from './SetupPage';
import BatchInstallPage from './BatchOper';
const FormItem = Form.Item;

const deviceAttachSelect =  [
  {key: 0, value: '自有'},
  {key: 1, value: '携机入网'}
]

const deviceStatusSelect =  [
  {key: 2, value: '库存状态'},
  {key: 4, value: '报修状态'},
  {key: 5, value: '报废状态'},
  {key: 9, value: '注销状态'}
]
const namespace = 'sdevice';
@connect(({ sdevice, loading }) => ({
  result: sdevice.data,
  loading: loading.effects['sdevice/search'] ? true : false,
}))
@Form.create()

export default class Sdevice extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    installVisible: false,
    editBatchVisible: false,
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
              <OrgSelect allData={true} placeholder='请选择归属' onChange={(val)=> this.onChangeOrg(val)}/>
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">品牌/型号 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('devData')(
              <DevTypeSelect allData={true} placeholder='请选择品牌' onChange={(val)=> this.onChangeDevType(val)}/>
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">设备序列号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('deviceSn')(
              <Input placeholder='请输入设备序列号'/>
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
  editDrawer = (res='') =>{
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailData: !editVisible ? res : ''
    })
  }

  // 安装
  installDrawer = (res='') =>{
    const { installVisible } = this.state;
    this.setState({
      installVisible: !installVisible,
      detailData: !installVisible ? res : ''
    })
  }

  // 批量安装
  editBatchDrawer = (res='') =>{
    const { editBatchVisible } = this.state;
    this.setState({
      editBatchVisible: !editBatchVisible,
      detailData: !editBatchVisible ? res : ''
    })
  }
  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '设备序列号', width: 150, dataIndex: 'deviceSn', key: 'deviceSn' },
      { title: '型号', width: 120, dataIndex: 'modelCode', key: 'modelCode' },
      { title: '品牌', dataIndex: 'devbrandName', key: 'devbrandName' },
      { title: '归属', dataIndex: 'instName', key: 'instName' },
      { title: '隶属标志', dataIndex: 'deviceAttachText', key: 'deviceAttachText' },
      { title: '入库批次', width: 120, dataIndex: 'devBatchId', key: 'devBatchId' },
      { title: '设备状态', dataIndex: 'deviceStatusText', key: 'deviceStatusText' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 200,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editDrawer(record)}}>修改</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.installDrawer(record)}}>安装</a>
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
          deviceSn,
          devbrandMapId,
          devbrandName,
          modelCode,
          deviceStatus,
          deviceAttach,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          instName,
          partnerName,
          partnerNameP,
          devBatchId,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          deviceSn,
          devbrandMapId,
          devbrandName,
          modelCode,
          deviceStatus,
          deviceStatusText: getObjStatus(deviceStatusSelect, deviceStatus),
          deviceAttach,
          deviceAttachText: getObjStatus(deviceAttachSelect, deviceAttach),
          instMapId,
          partnerMapIdP,
          partnerMapId,
          instName,
          partnerName,
          partnerNameP,
          devBatchId,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 设备库存
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={
            <span>
              <Button style={{marginRight:'8px'}} type="primary" onClick={()=>{this.editBatchDrawer()}}>批量操作</Button>
              <Button type="primary" onClick={()=>{this.editDrawer()}}>添加</Button>
            </span>
          }
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
        <Drawer
          title={'安装'}
          placement="right"
          width={'30%'}
          destroyOnClose={true}
          onClose={this.installDrawer}
          visible={this.state.installVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <SetupPage
            detailData={detailData}
            onClose={this.installDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.installDrawer()
              }
            }
          />
        </Drawer>

        <Drawer
          title={'批量安装'}
          placement="right"
          width={'40%'}
          destroyOnClose={true}
          onClose={this.editBatchDrawer}
          visible={this.state.editBatchVisible}
          maskClosable={false}
          //className='ant-drawer-body'
          // bodyStyle={{
          //   height: 'calc(100% - 55px)',
          //   overflow: 'auto',
          //   paddingBottom: '0px'
          // }}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: '0px'
            //paddingBottom: 53,
          }}
        >
          <BatchInstallPage
            detailData={detailData}
            onClose={this.editBatchDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.editBatchDrawer()
              }
            }
          />
        </Drawer>
      </div>
    );
  }
}