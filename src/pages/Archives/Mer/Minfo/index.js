import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, getOrgData} from '@/utils/utils';
import OrgSelect from '@/components/TKOrgSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const checkStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '冻结'},
  {key: 2, value: '待审核'},
  {key: 9, value: '注销'}
]
const namespace = 'merchantinfo';
@connect(({ merchantinfo, loading }) => ({
  result: merchantinfo.data,
  loading: loading.effects['merchantinfo/search'] ? true : false,
}))

@Form.create()

export default class Partner extends Component {
  state = {
    detailId: null,
    detailVisible: false,
    editVisible: false,

    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {
       // flagStatus: 0,
      }
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

  /* 查询操作 */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    let oldQuery = this.state.queryParam
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { merName } = fieldsValue
      oldQuery.pageNumber = 1
      oldQuery.condition['merName'] = merName
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
        condition: {
          //flagStatus:0
        }
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
              <Input placeholder='请选择商户名称' />
            )}
          </FormItem>
        </div>

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

  /* 撤销操作 */
  //flagStatus---1:冻结　2:删除　0:解冻
  handleRevoke = e => {
    const { dispatch } = this.props;

    let queryParam = {
      merMapId: e.merMapId,
      flagStatus: e.flagStatus == 1 ? 0 : 1
    }
    dispatch({
      type: `${namespace}/revoke`,
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
  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '商户编号', width: 160, dataIndex: 'merMapId', key: 'merMapId' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      // { title: '地址', width: 180, dataIndex: 'commAddress', key: 'commAddress' },
      // { title: '联系手机', width: 100, dataIndex: 'commMobile', key: 'commMobile' },
      { title: '状态', width: 80, dataIndex: 'flagStatusText', key: 'flagStatusText' },
      { title: '创建时间', width: 110, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            {/* <a onClick={()=>{this.editDrawer(record)}}>变更</a>
            <Divider type="vertical" /> */}
            {record.flagStatus != 1 ? 
            <a onClick={()=>{this.editDrawer(record)}}>变更</a>
            : <a href="javascript:void(0)" style={{color: '#ccc'}}>变更</a>
            }
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleRevoke(record)}}>
              {record.flagStatus == 1 ? <a>解冻</a> : <a>冻结</a> }
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const listData = this.props.result.data || {}

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
          changType,
          changeOrder,
          flagStatus,
          checkType,
          commCityCountyName,
          commCityName,
          commCityProvName,
          instMapId,
          merMapId,
          merMapIdP,
          merName,
          partnerMapId,
          partnerMapIdP,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          changType,
          changeOrder,
          flagStatus,
          flagStatusText: getObjStatus(checkStatusSelect, flagStatus),
          checkType,
          commCityCountyName,
          commCityName,
          commCityProvName,
          instMapId,
          merMapId,
          merMapIdP,
          merName,
          partnerMapId,
          partnerMapIdP,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 商户信息
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
        >
          <Table
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
          width={'48%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage
            detailData={detailData}
            onClose={this.detailDrawer}
          />
        </Drawer>

        <Drawer
          title={detailData ? '变更' : '添加'}
          placement="right"
          width={'48%'}
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