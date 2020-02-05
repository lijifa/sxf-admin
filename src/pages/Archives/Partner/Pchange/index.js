import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Modal } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import HistoryListPage from './HistoryListPage';
const FormItem = Form.Item;

const checkStatusSelect = [
  {key: 0, value: '通过审核'},
  {key: 1, value: '待审核'},
  {key: 2, value: '审核未通过'}
]
const changeTypeSelect =  [
  {key: 0, value: '添加信息'},
  {key: 1, value: '修改信息'},
  {key: 2, value: '删除'}
]

const checkTypeSelect =  [
  // {key: 0, value: '进件审核'},
  // {key: 1, value: '基本信息审核'},
  // {key: 2, value: '风控审核'},
  {key: 3, value: '证照审核'},
  {key: 4, value: '账户审核'},
  {key: 5, value: '扣率审核'}
]
const namespace = 'partnerchange';
@connect(({ partnerchange, loading }) => ({
  result: partnerchange.data,
  loading: loading.effects['partnerchange/search'] ? true : false,
}))
@Form.create()

export default class Coin extends Component {
  state = {
    detailId: null,
    detailData: null,
    detailVisible: false,
    editVisible: false,
    hisVisible: false,
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

  // queryChange (key, val, falg = false) {
  //   let oldQuery = this.state.queryParam
  //   if(falg){
  //     oldQuery.pageNumber = 1
  //     oldQuery.condition[key] = val
  //     this.setState({queryParam: oldQuery})
  //   } else {
  //     let tmpObj = {pageNumber: 1}
  //     tmpObj[key] = val
  //     this.setState({queryParam: Object.assign({}, oldQuery, tmpObj)})
  //   }
  // }

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
        condition: {
          checkType: 3,
          checkStatus: 1
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
        {/* <div className="kuai">
          <span className="span">渠道名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('partnerName')(
              <Input placeholder='请输入渠道名称' />
            )}
          </FormItem>
        </div> */}
        <div className="kuai">
          <span className="span">申请类型 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('checkType', Object.assign({}, {}, {initialValue: 3}))
            (
              <StatusSelect options={checkTypeSelect} placeholder='请输入申请类型' />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">变更信息 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('changeType')(
              <StatusSelect options={changeTypeSelect} placeholder='请输入变更信息' />
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
  handleRevoke = e => {
    const { dispatch } = this.props;
    const { queryParam } = this.state;

    let listType = queryParam.condition.checkType
    let param = {}
    switch (listType) {
      case 3:
        param = {
          pcerttmp: {
            id: e.id
          }
        }
        break;
      case 4:
        param = {
          pbanktmp: {
            id: e.id
          }
        }
        break;
      case 5:
        param = {
          pdrtmp: {
            id: e.id
          }
        }
        break;
    }

    dispatch({
      type: `${namespace}/revoke`,
      payload: param,
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

  historyListModel = (res='') => {
    const { hisVisible } = this.state
    this.setState({
      hisVisible: !hisVisible,
      detailData: !hisVisible ? res : ''
    });
  };

  render() {
    const {detailId, detailData, queryParam, hisVisible} = this.state
    const columns = [
      { title: 'ID', width: 120, dataIndex: 'id', key: 'id' },
      { title: '渠道名称', dataIndex: 'partnerName', key: 'partnerName' },
      { title: '申请类型', width: 120, dataIndex: 'checkTypeText', key: 'checkTypeText' },
      { title: '变更信息', width: 120, dataIndex: 'changeTypeText', key: 'changeTypeText' },
      { title: '变更状态', width: 120, dataIndex: 'checkStatusText', key: 'checkStatusText' },
      { title: '变更时间', dataIndex: 'timeCreate', key: 'timeCreate' },
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
            <a onClick={()=>{this.historyListModel(record)}}>变更历史</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleRevoke(record)}}>
              <a>撤销</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    let {result, loading} = this.props
    let listType = queryParam.condition.checkType
    let pageFlag = '1'
    let listData = ''
    switch (listType) {
      case 3:
        listData = result.data.pcerttmpPage || {}
        pageFlag = 1
        break;
      case 4:
        listData = result.data.pbanktmpPage || {}
        pageFlag = 2
        break;
      case 5:
        listData = result.data.pdrtmpPage || {}
        pageFlag = 3
        break;
    }

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
          partnerMapId,
          partnerName,
          changeType,
          checkStatus,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          partnerMapId,
          partnerName,
          itemData: item,
          changeType,
          checkStatusText: getObjStatus(checkStatusSelect, checkStatus),
          checkTypeText: getObjStatus(checkTypeSelect, listType),
          changeTypeText: getObjStatus(changeTypeSelect, changeType),
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 渠道变更
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
            pagination={tablePagination}
          />
        </Card>
        <Drawer
          title={detailData ? detailData.checkTypeText: '详情'}
          placement="right"
          width={'50%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage
            pageFlag={pageFlag}
            detailData={detailData}
            onClose={this.detailDrawer}
          />
        </Drawer>

        <Drawer
          title={detailData ? detailData.checkTypeText: '变更'}
          placement="right"
          width={'50%'}
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

        <Modal
          title="变更历史"
          destroyOnClose={true}
          centered={true}
          visible={hisVisible}
          maskClosable={false}
          bodyStyle={{textAlign:'center'}}
          width={800}
          footer={null}
          onCancel={()=>{this.historyListModel()}}
        >
          <HistoryListPage
            detailData={detailData}
            onClose={this.historyListModel}
            onReturnList={this.props.onReturnList}
            checkType={listType}
          />
        </Modal>
      </div>
    );
  }
}