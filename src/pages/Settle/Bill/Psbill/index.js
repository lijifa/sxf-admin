import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select, DatePicker } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, covertMoney2Yuan} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import moment from "moment";

const FormItem = Form.Item;
const { RangePicker } = DatePicker

const ticketFlagSelect =  [
  {key: 'Y', value: '已开'},
  {key: 'N', value: '未开'},
  {key: '-', value: '无'},
]

const namespace = 'psbill';
@connect(({ psbill, loading }) => ({
  result: psbill.data,
  resultLoading: loading.effects['psbill/search'] ? true : false
}))
@Form.create()

export default class Htbill extends Component {
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
      const { partnerMapId, date } = fieldsValue
      const values = {
        partnerMapId,
        settleStartDate: date ? moment(date[0]).format('YYYYMMDD') : '',
        settleEndDate: date ? moment(date[1]).format('YYYYMMDD') : '',
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
          <span className="span">渠道编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('partnerMapId')(
              <Input placeholder='请输入渠道编号'/>
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

  // 发票标记ticketFlag
  update = e => {
    const { dispatch } = this.props;

    let queryParam = {
      id: e.id,
      ticketFlag: 'Y',
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

  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '划拨日期', dataIndex: 'settleDate', key: 'settleDate' },
      { title: '渠道编号', dataIndex: 'partnerMapId', key: 'partnerMapId' },
      { title: '渠道名称', dataIndex: 'partnerName', key: 'partnerName' },
      { title: '划拨金额', dataIndex: 'settleAmt_str', key: 'settleAmt_str' },
      { title: '户名', dataIndex: 'settleAcctName', key: 'settleAcctName' },
      { title: '帐号', dataIndex: 'settleAcctNo', key: 'settleAcctNo' },
      { title: '银行', dataIndex: 'settleBankName', key: 'settleBankName' },
      { title: '发票', dataIndex: 'ticketFlag_str', key: 'ticketFlag_str' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.update(record)}}>
              <a>发票标记</a>
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
          partnerMapIdP,
          partnerMapId,
          settleDate,
          settleAmt,
          settleFlag,
          settleFee,
          settleAcctName,
          settleAcctNo,
          settleBankBid,
          settleBidName,
          settleBankId,
          settleBankName,
          coinCode,
          coinSymbol,
          coinUnit,
          coinPoint,
          ticketFlag,
          dataReserve,
          timeUpdate,
          timeCreate,
          partnerName,
        } = item

        return {
          key: idx,
          id,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          settleDate,
          settleAmt,
          settleFlag,
          settleFee,
          settleAcctName,
          settleAcctNo,
          settleBankBid,
          settleBidName,
          settleBankId,
          settleBankName,
          coinCode,
          coinSymbol,
          coinUnit,
          coinPoint,
          ticketFlag,
          dataReserve,

          ticketFlag_str: getObjStatus(ticketFlagSelect, ticketFlag),
          settleAmt_str: coinUnit + ':' + covertMoney2Yuan(settleAmt),
          settleFee_str: coinUnit + ':' + covertMoney2Yuan(settleFee),
          timeUpdate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          timeCreate: formatTime(timeCreate, 'YYYY-MM-DD HH:mm:ss'),
          partnerName
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
              title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 商户划拨明细
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

      </div>
    );
  }
}