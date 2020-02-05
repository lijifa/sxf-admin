import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, DatePicker } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import styles from '../TableList.less';
import DetailPage from './DetailPage';
const { RangePicker } = DatePicker;
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
const namespace = 'merchantchange';
@connect(({ merchantchange, loading }) => ({
  result: merchantchange.dataHis,
  loading: loading.effects['merchantchange/searchchange'] ? true : false,
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
        merMapId: this.props.detailData.merMapId,
        checkType: this.props.checkType
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
      type: `${namespace}/searchchange`,
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
      const {changeDate, merName} = fieldsValue
      let date= changeDate ? changeTime(changeDate[0], changeDate[1]) : ''
      const values = {
        merName
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          startDate: date ? date[0] : '',
          endDate: date ? date[1] : '',
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
        {/* <div className="kuai">
          <span className="span">渠道名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merName')(
              <Input placeholder='请输入渠道名称' />
            )}
          </FormItem>
        </div> */}
        
        <div className="kuai" style={{textAlign: "left"}}>
          <span className="span">变更日期 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('changeDate')(
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
  //详情
  detailDrawer = (res='') =>{
    const { detailVisible } = this.state;
    this.setState({
      detailVisible: !detailVisible,
      detailData: !detailVisible ? res : ''
    })
  }

  render() {
    const { detailData, queryParam} = this.state
    const columns = [
      { title: 'ID', width: 120, dataIndex: 'id', key: 'id' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      { title: '变更信息', width: 120, dataIndex: 'changeTypeText', key: 'changeTypeText' },
      { title: '变更时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 120,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
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
        listData = result.data.mcerttmpPage || {}
        pageFlag = 1
        break;
      case 4:
        listData = result.data.mbanktmpPage || {}
        pageFlag = 2
        break;
      case 5:
        listData = result.data.mdrtmpPage || {}
        pageFlag = 3
        break;
    }
    const tablePagination = {
      total: listData.totalRow || 0,
    }

    let tableData = null
    let list = listData.list
    if (list) {
      tableData = list.map((item, idx) => {
        const {
          id,
          merName,
          changeType,
          checkStatus,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          merName,
          itemData: item,
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
          style={{textAlign: 'left'}}
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 商户变更历史
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
      </div>
    );
  }
}