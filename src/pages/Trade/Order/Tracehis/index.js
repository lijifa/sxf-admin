import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, TimePicker, DatePicker } from "antd";
import { connect } from 'dva';
import moment from 'moment'
import {formatTime, responseMsg, getObjStatus, changeTime, covertMoney2Yuan} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import PaytypeSelect from '@/components/TKPaytypeSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker

const transStatusSelect = [
  {key: 0, value: '成功'},
  {key: 1, value: '失败'},
  {key: 9, value: '处理中'}
]
const transTypeSelect = [
  {key: 0, value: '系统'},
  {key: 1, value: '手工'},
]


const namespace = 'ptrace';
const mapStateToProps = (state) => {
  const result = state[namespace].data;
  return {
    result
  };
};

@connect(mapStateToProps)

@Form.create()

export default class Lang extends Component {
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

  /* 查询操作 */
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    let oldQuery = this.state.queryParam
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        paytypeMapId,
        transMerNo,
        panNo,
        transPosTimeStart,
        transPosTimeEnd,
        date
      } = fieldsValue

      const values = {
        paytypeMapId,
        transMerNo,
        panNo,
        transPosDateStart: date ? moment(date[0]).format('YYYYMMDD') : '',
        transPosDateEnd: date ? moment(date[1]).format('YYYYMMDD') : '',
        transPosTimeStart: transPosTimeStart ? transPosTimeStart.format('HHmmss') : null,
        transPosTimeEnd: transPosTimeEnd ? transPosTimeEnd.format('HHmmss') : null,
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
          <span className="span">支付方式 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('paytypeMapId')(
              <PaytypeSelect placeholder='请选择支付方式'/>
            )}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">商户编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transMerNo')(
              <Input maxLength={20} placeholder='请输入商户编号' />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">账号后四位 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('panNo')(
              <Input maxLength={4} placeholder='请输入后四位' />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">开始时间 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transPosTimeStart')(
              <TimePicker style={{width: 160}} format={'HH:mm:ss'} placeholder='请选择交易时间' />
            )}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">结束时间 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('transPosTimeEnd')(
              <TimePicker style={{width: 160}} format={'HH:mm:ss'} placeholder='请选择交易时间' />
            )}
          </FormItem>
        </div>

        <div className="kuai">
          <span className="span">交易日期 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('date')(
              <RangePicker format={'YYYYMMDD'}/>
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
      { title: '交易类型', dataIndex: 'transId', key: 'transId' },
      { title: '交易金额', dataIndex: 'amtTrans', key: 'amtTrans' },
      { title: '交易结果', dataIndex: 'transStatus', key: 'transStatus' },
      { title: '状态', dataIndex: 'status', key: 'status' },
      { title: '交易时间', dataIndex: 'timeCreate', key: 'timeCreate' },
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
          shopMapId,
          paytypeMapId,
          transId,
          transSubid,
          transSubname,
          transType,
          transRetcode,
          transRetdesc,
          transStatus,
          transVoidflag,
          transReverflag,
          transRefundflag,
          transRiskFlag,
          transMac,
          transMerNo,
          transMerName,
          transPosNo,
          transPosMode,
          transCardSn,
          transPosService,
          transPincap,
          transProcCode,
          transPosBatch,
          transPosTrace,
          transIc,
          transCountryId,
          transCityCountyId,
          transPosDate,
          transPosTime,
          hostMapId,
          hostTrace,
          hostAuth,
          hostMerNo,
          hostPosNo,
          hostPosBatch,
          hostPosTrace,
          panBankName,
          panNo,
          panExp,
          panCardcd,
          panCardtype,
          transCoinId,
          transCoinCode,
          transCoinSymbol,
          transCoinPoint,
          amtTrans,
          amtRefund,
          amtMer,
          amtMerMdr,
          amtMdrHostFee,
          amtFeeIss,
          amtFeeNet,
          amtFeeBrand,
          amtMdrPlatFee,
          amtFeeInst,
          amtFeePartnerP,
          amtFeePartner,
          amtFeePlat,
          settleFlagPos,
          settleFlagHost,
          settleDateMer,
          settleDatePlat,
          settleDateInst,
          settleDatePartner,
          checkFlag,
          errorFlag,
          dataReserve,
          timeUpdate,
          timeCreate,

          sysRef,
          traceIndex1,
          traceIndex2,
          orderNo,
          traceMesgOrg,
          traceIndex1Org,
          paytypeName,
          transName,
          transPosDateStart,
          transPosDateEnd,
          transPosTimeStart,
          transPosTimeEnd,
          hostName,
        } = item

        return {
          key: idx,
          id,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          merMapIdP,
          merMapId,
          shopMapId,
          paytypeMapId,
          transId,
          transSubid,
          transSubname,
          transType: getObjStatus(transTypeSelect, transType),
          transRetcode,
          transRetdesc,
          transStatus: getObjStatus(transStatusSelect, transStatus),
          transVoidflag,
          transReverflag,
          transRefundflag,
          transRiskFlag,
          transMac,
          transMerNo,
          transMerName,
          transPosNo,
          transPosMode,
          transCardSn,
          transPosService,
          transPincap,
          transProcCode,
          transPosBatch,
          transPosTrace,
          transIc,
          transCountryId,
          transCityCountyId,
          transPosDate,
          transPosTime,
          hostMapId,
          hostTrace,
          hostAuth,
          hostMerNo,
          hostPosNo,
          hostPosBatch,
          hostPosTrace,
          panBankName,
          panNo,
          panExp,
          panCardcd,
          panCardtype,
          transCoinId,
          transCoinCode,
          transCoinSymbol,
          transCoinPoint,
          amtTrans: covertMoney2Yuan(amtTrans),
          amtRefund,
          amtMer: covertMoney2Yuan(amtMer),
          amtMerMdr: covertMoney2Yuan(amtMerMdr),
          amtMdrHostFee: covertMoney2Yuan(amtMdrHostFee),
          amtFeeIss: covertMoney2Yuan(amtFeeIss),
          amtFeeNet: covertMoney2Yuan(amtFeeNet),
          amtFeeBrand: covertMoney2Yuan(amtFeeBrand),
          amtMdrPlatFee: covertMoney2Yuan(amtMdrPlatFee),
          amtFeeInst: covertMoney2Yuan(amtFeeInst),
          amtFeePartnerP,
          amtFeePartner: covertMoney2Yuan(amtFeePartner),
          amtFeePlat,
          settleFlagPos,
          settleFlagHost,
          settleDateMer,
          settleDatePlat,
          settleDateInst,
          settleDatePartner,
          checkFlag,
          errorFlag,
          dataReserve,
          status: transVoidflag ? '撤销' : (transReverflag ? '冲正' : (transRefundflag ? '退货' : '-')),
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),

          sysRef,
          traceIndex1,
          traceIndex2,
          orderNo,
          traceMesgOrg,
          traceIndex1Org,
          paytypeName,
          transName,
          transPosDateStart,
          transPosDateEnd,
          transPosTimeStart,
          transPosTimeEnd,
          hostName,
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
              title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 历史交易流水
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
          width={'60%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

      </div>
    );
  }
}