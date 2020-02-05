import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select, DatePicker, TimePicker } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, covertMoney2Yuan, changeMomentToTmp} from '@/utils/utils';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import moment from "moment";

const FormItem = Form.Item;
const { RangePicker } = DatePicker
const transRiskFlagSelect = [
  {key: 1, value: '可疑风险'},
  {key: 2, value: '中度风险'},
  {key: 3, value: '高危风险'},
  {key: 9, value: '拒绝'},
]

const formatTransTime = (t) => {
  const t1 = String(t).slice(-2)
  const t2 = String(t).slice(-4, -2)
  const t3 = String(t).slice(t.length, -4)
  return t3 + ':'+ t2 + ':' + t1
}
const formatTransDate = (t) => {
  const t1 = String(t).slice(-2)
  const t2 = String(t).slice(-4, -2)
  const t3 = String(t).slice(-8, -4)
  return t3 + '-'+ t2 + '-' + t1
}

const namespace = 'trace';
@connect(({ trace, loading }) => ({
  result: trace.data,
  resultLoading: loading.effects['trace/search'] ? true : false
}))
@Form.create()


export default class Risktrace extends Component {
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
      const {
        transMerNo,
        panNo,
        transPosStartTime,
        transPosEndTime,
        date,
      }
      = fieldsValue
      const values = {
        transMerNo,
        panNo,
        transPosStartDate: date ? moment(date[0]).format('YYYYMMDD') : '',
        transPosEndDate: date ? moment(date[1]).format('YYYYMMDD') : '',
        transPosStartTime: transPosStartTime ? transPosStartTime.format('HHmmss') : null,
        transPosEndTime: transPosEndTime ? transPosEndTime.format('HHmmss') : null,
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
          <span className="span">商户编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transMerNo')(
              <Input placeholder='请输入商户编号'/>
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">卡号后四位 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('panNo')(
              <Input maxLength={4} placeholder='请输入卡号后四位'/>
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">开始时间 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transPosStartTime')(
              <TimePicker style={{width: 160}} format={'HH:mm:ss'} placeholder='请选择交易时间' />
            )}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">结束时间 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transPosEndTime')(
              <TimePicker style={{width: 160}} format={'HH:mm:ss'} placeholder='请选择交易时间' />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">交易日期 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('date')(
              <RangePicker />
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
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '商户编号', dataIndex: 'transMerNo', key: 'transMerNo' },
      { title: '商户名称', dataIndex: 'transMerName', key: 'transMerName' },
      { title: '支付方式', dataIndex: 'paytypeName', key: 'paytypeName' },
      { title: '帐号/卡号', dataIndex: 'panNo', key: 'panNo' },
      { title: '交易类型', dataIndex: 'transSubname', key: 'transSubname' },
      { title: '交易金额', dataIndex: 'amtTrans_str', key: 'amtTrans_str' },
      { title: '风险', dataIndex: 'transRiskFlag_str', key: 'transRiskFlag_str' },
      { title: '交易时间', dataIndex: 'date', key: 'date' },
      { title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={()=>{this.editDrawer(record)}}>修改</a>*/}
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
          sysRef,
          traceIndex1,
          instMapId,
          paytypeMapId,
          transSubname,
          transRiskFlag,
          transMerNo,
          transMerName,
          transPosTrace,
          transPosDate,
          transPosTime,
          panNo,
          transCoinId,
          transCoinCode,
          transCoinSymbol,
          transCoinPoint,
          amtTrans,
          ruleId,
          ruleName,
          dataReserve,
          timeUpdate,
          timeCreate,
          paytypeName,
        } = item

        return {
          key: idx,
          id,
          sysRef,
          traceIndex1,
          instMapId,
          paytypeMapId,
          transSubname,
          transRiskFlag,
          transRiskFlag_str: getObjStatus(transRiskFlagSelect, transRiskFlag),
          transMerNo,
          transMerName,
          transPosTrace,
          transPosDate,
          transPosTime,
          panNo,
          transCoinId,
          transCoinCode,
          transCoinSymbol,
          transCoinPoint,
          amtTrans: amtTrans,
          amtTrans_str: transCoinCode + ':' + covertMoney2Yuan(amtTrans),
          ruleId,
          ruleName,
          dataReserve,
          timeUpdate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          timeCreate: formatTime(timeCreate, 'YYYY-MM-DD HH:mm:ss'),
          // date: `${transPosDate} ${transPosTime}`,
          date: formatTransDate(transPosDate) + ' ' + formatTransTime(transPosTime) ,
          paytypeName,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 风险交易流水
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
          width={'40%'}
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
          width={'40%'}
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