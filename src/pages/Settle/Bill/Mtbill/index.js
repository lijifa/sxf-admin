import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select, DatePicker } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, covertMoney2Yuan} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import TKHostSelect from '@/components/TKHostSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import moment from "moment";

const FormItem = Form.Item;

const { RangePicker } = DatePicker

const settleTypeSelect =  [
  {key: '0', value: '代理模式'},
  {key: '1', value: '收单模式'},
]

const namespace = 'mtbill';
@connect(({ mtbill, loading }) => ({
  result: mtbill.data,
  resultLoading: loading.effects['mtbill/search'] ? true : false
}))
@Form.create()

export default class Htbill extends Component {
  state = {
    detailData: null,
    detailVisible: false,

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
      const { merNo, date } = fieldsValue
      const values = {
        merNo,
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
          <span className="span">商户编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merNo')(
              <Input placeholder='请输入商户编号'/>
            )}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">清算日期 :</span>
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
      { title: '清算日期', dataIndex: 'settleDate', key: 'settleDate' },
      { title: '商户编号', dataIndex: 'merNo', key: 'merNo' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      { title: '结算金额', dataIndex: 'settleAmt_str', key: 'settleAmt_str' },
      { title: '交易总金额', dataIndex: 'ptTransAmt_str', key: 'ptTransAmt_str' },
      { title: '交易总笔数', dataIndex: 'ptTransCnt', key: 'ptTransCnt' },
      { title: '结算方式', dataIndex: 'settleType_str', key: 'settleType_str' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
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
          merMapIdP,
          merMapId,
          settleDate,
          merNo,
          merName,
          transDatetimeB,
          transDatetimeE,
          settleCoinId,
          settleCoinCode,
          settleCoinSymbol,
          settleCoinPoint,
          settleType,
          settleFlag,
          settleAmt,
          settleFee,
          ptTransCnt,
          ptTransCntC,
          ptTransCntD,
          ptTransCntFail,
          ptTransCntErr,
          ptTransCntRisk,
          ptTransAmt,
          ptTransAmtC,
          ptTransAmtD,
          ptTransAmtFail,
          ptTransAmtErr,
          ptTransAmtRisk,
          ptAmtMerSettle,
          ptAmtMerMdr,
          ptMdrHostFee,
          ptFeeIss,
          ptFeeNet,
          ptFeeLogo,
          ptMdrPlatFee,
          ptFeePartner,
          ptFeePlat,
          dataReserve,
          timeUpdate,
          timeCreate,
        } = item

        return {
          key: idx,
          id,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          merMapIdP,
          merMapId,
          settleDate,
          merNo,
          merName,
          transDatetimeB,
          transDatetimeE,
          settleCoinId,
          settleCoinCode,
          settleCoinSymbol,
          settleCoinPoint,
          settleType,
          settleFlag,
          settleAmt,
          settleFee,
          ptTransCnt,
          ptTransCntC,
          ptTransCntD,
          ptTransCntFail,
          ptTransCntErr,
          ptTransCntRisk,
          ptTransAmt,
          ptTransAmtC,
          ptTransAmtD,
          ptTransAmtFail,
          ptTransAmtErr,
          ptTransAmtRisk,
          ptAmtMerSettle,
          ptAmtMerMdr,
          ptMdrHostFee,
          ptFeeIss,
          ptFeeNet,
          ptFeeLogo,
          ptMdrPlatFee,
          ptFeePartner,
          ptFeePlat,
          dataReserve,
          timeUpdate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          timeCreate: formatTime(timeCreate, 'YYYY-MM-DD HH:mm:ss'),
          settleAmt_str: settleCoinCode + ':' + covertMoney2Yuan(settleAmt),
          ptTransAmt_str: settleCoinCode + ':' + covertMoney2Yuan(ptTransAmt),
          ptAmtMerSettle_str: settleCoinCode + ':' + covertMoney2Yuan(ptAmtMerSettle),
          ptAmtMerMdr_str: settleCoinCode + ':' + covertMoney2Yuan(ptAmtMerMdr),
          settleType_str: getObjStatus(settleTypeSelect, settleType),
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 商户日对账单
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