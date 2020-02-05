import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, DatePicker } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, getOrgData} from '@/utils/utils';
import OrgSelect from '@/components/TKOrgSelect';
import StatusSelect from '@/components/MsStatusSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const checkStatusSelect = [
  {key: 0, value: '通过审核'},
  {key: 1, value: '待审核'},
  {key: 2, value: '审核未通过'}
]
const changeTypeSelect = [
  {key: 0, value: '添加信息'},
  {key: 1, value: '修改信息'},
  {key: 2, value: '删除'}
]

const checkTypeSelect = [
  {key: 0, value: '进件审核'},
  {key: 1, value: '基本信息审核'},
  {key: 2, value: '风控审核'},
  {key: 3, value: '证照审核'},
  {key: 4, value: '账户审核'},
  {key: 5, value: '扣率审核'}
]
const namespace = 'partnercheck';
@connect(({ partnercheck, loading }) => ({
  result: partnercheck.data,
  loading: loading.effects['partnercheck/search'] ? true : false,
}))
@Form.create()

export default class Coin extends Component {
  state = {
    detailId: null,
    detailData: null,
    detailVisible: false,
    editVisible: false,
    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {
        checkType: 3,
        checkStatus: 1,
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

  valueChanged(key, value) {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  /* 查询操作 */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    let oldQuery = this.state.queryParam
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {partnerName, changeType, checkType} = fieldsValue
      const values = {
        partnerName,
        changeType,
        checkType,
        checkStatus: 1
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
          <span className="span">渠道名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('partnerName')(
              <Input placeholder='请输入渠道名称' />
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
        <div className="kuai">
          <span className="span">变更日期 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('logData')(
              <RangePicker style={{width: '220px'}}/>
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
  render() {
    const {detailId, detailData, queryParam} = this.state
    const columns = [
      { title: '渠道编号', width: 160, dataIndex: 'partnerMapId', key: 'partnerMapId' },
      { title: '渠道名称', dataIndex: 'partnerName', key: 'partnerName' },
      // { title: '地址', width: 180, dataIndex: 'commAddress', key: 'commAddress' },
      // { title: '联系手机', width: 100, dataIndex: 'commMobile', key: 'commMobile' },
      { title: '状态', width: 80, dataIndex: 'flagStatus', key: 'flagStatus' },
      { title: '创建时间', width: 110, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>审核</a>
          </Fragment>
        ),
      },
    ];
    let {result, loading} = this.props
    //let listType = queryParam.condition.checkType
    let pageFlag = '1'
    let listData = result.data || {}
    // switch (listType) {
    //   case 3:
    //     listData = result.data.pcerttmpPage || {}
    //     pageFlag = 1
    //     break;
    //   case 4:
    //     listData = result.data.pbanktmpPage || {}
    //     pageFlag = 2
    //     break;
    //   case 5:
    //     listData = result.data.pdrtmpPage || {}
    //     pageFlag = 3
    //     break;
    // }
    const tablePagination = {
      total: listData.totalRow || 0,
    }

    let tableData = null
    let list = listData.list
    if (list) {
      tableData = list.map((item, idx) => {
        const {
          id,
          partnerMapId,
          partnerName,
          checkStatus,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          partnerMapId,
          partnerName,
          flagStatus: getObjStatus(checkStatusSelect, checkStatus),
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 渠道审核
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
        >
          <Table
            loading={loading}
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{x: 800}}
          />
        </Card>
        <Drawer
          title={'审核明细'}
          placement="right"
          width={'80%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage
            pageFlag={pageFlag}
            detailData={detailData}
            onClose={this.detailDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.detailDrawer()
              }
            }
          />
        </Drawer>

        <Drawer
          title={'审核明细'}
          placement="right"
          width={'80%'}
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
            detailId={detailId}
            pageFlag={pageFlag}
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