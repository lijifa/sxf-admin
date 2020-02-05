import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import RiskruleSelect from '@/components/RiskruleSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;
const riskStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'},
]
const riskTSelect = [
  {key: 0, value: '当天'},
  {key: 1, value: '一天'},
  {key: 7, value: '七天'},
  {key: 30, value: '三十天'},
]
const merGradeSelect = [
  {key: 0, value: '所有'},
  {key: 1, value: '优'},
  {key: 2, value: '良'},
  {key: 3, value: '合格'},
  {key: 4, value: '可疑'},
  {key: 5, value: '风险'},
]
const riskActiveSelect = [
  {key: 1, value: '可疑风险'},
  {key: 2, value: '中度风险'},
  {key: 3, value: '高危风险'},
  {key: 9, value: '拒绝'},
]

const namespace = 'ruleval';
@connect(({ ruleval, loading }) => ({
  result: ruleval.data,
  resultLoading: loading.effects['ruleval/search'] ? true : false
}))
@Form.create()

export default class Ruleval extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,

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
      const { ruleId } = fieldsValue
      const values = {
        ruleId
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          // startDate: date ? date[0] : '',
          // endDate: date ? date[1] : '',
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
          <span className="span">风控规则 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('ruleId')(
              <RiskruleSelect placeholder='请选择风控规则'/>
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
      id: e.id,
      riskStatus: '9',
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
  };

  // 启用暂停
  startAndStop = e => {
    const { dispatch } = this.props;

    let queryParam = {
      id: e.id,
      riskStatus: e.riskStatus == '0' ? '1' : '0',
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
      { title: '风控ID', dataIndex: 'ruleId', key: 'ruleId' },
      { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
      { title: '周期', dataIndex: 'riskT_str', key: 'riskT_str' },
      { title: '阈值', dataIndex: 'riskTarget', key: 'riskTarget' },
      { title: '积数', dataIndex: 'activeBound', key: 'activeBound' },
      { title: '处理', dataIndex: 'riskActive_str', key: 'riskActive_str' },
      { title: '状态', dataIndex: 'riskStatus_str', key: 'riskStatus_str' },
      { title: '适用商户', dataIndex: 'merGrade_str', key: 'merGrade_str' },
      { title: '适用MCC', dataIndex: 'mccName_str', key: 'mccName_str' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editDrawer(record)}}>修改</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.startAndStop(record)}}>{ record.riskStatus == '0' ? '暂停' : '启用'}</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleDel(record)}}>
              <a>删除</a>
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
          instMapId,
          ruleId,
          riskStatus,
          riskT,
          merGrade,
          mccId,
          mccIdP,
          riskPara,
          riskTarget,
          activeBound,
          riskActive,
          dataReserve,
          timeUpdate,
          timeCreate,
          ruleName,
          instName,
          mccName,
          mccNameP,
        } = item

        return {
          key: idx,
          id,
          instMapId,
          ruleId,
          riskStatus,
          riskStatus_str: getObjStatus(riskStatusSelect, riskStatus),
          riskT,
          riskT_str: getObjStatus(riskTSelect, riskT),
          merGrade,
          merGrade_str: getObjStatus(merGradeSelect, merGrade),
          mccId,
          mccIdP,
          riskPara,
          riskTarget,
          activeBound,
          riskActive,
          riskActive_str: getObjStatus(riskActiveSelect, riskActive),
          dataReserve,
          timeUpdate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          timeCreate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          ruleName,
          instName,
          mccName,
          mccName_str: mccNameP + '/' + mccName,
          mccNameP,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 风控阈值
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>添加</Button>}
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
          width={'30%'}
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