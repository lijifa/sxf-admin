import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, covertMoney2Yuan} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import TKHostSelect from '@/components/TKHostSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;

const ruleStatusSelect =  [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'},
]

const ruleModeSelect =  [
  {key: '1', value: '百分比'},
  {key: '2', value: '绝对值'},
]

const ruleTypeSelect =  [
  {key: '0', value: '实时'},
  {key: '1', value: '事后'},
]
const namespace = 'hbal';
@connect(({ hbal, loading }) => ({
  result: hbal.data,
  resultLoading: loading.effects['hbal/search'] ? true : false
}))
@Form.create()

export default class Hbal extends Component {
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
      const { hostMapId } = fieldsValue
      const values = {
        hostMapId
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
          <span className="span">归属通道 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('hostMapId')(
              <TKHostSelect
                placeholder='请选择归属通道'
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

  /* 删除操作 */
  handleDel = e => {
    const { dispatch } = this.props;

    let queryParam = {
      id: e.id,
      ruleStatus: '9',
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
      ruleStatus: e.ruleStatus == '0' ? '1' : '0',
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
      { title: '机构名称', dataIndex: 'instName', key: 'instName' },
      { title: '通道编号', dataIndex: 'hostMapId', key: 'hostMapId' },
      { title: '通道名称', dataIndex: 'hostName', key: 'hostName' },
      { title: '余额', dataIndex: 'tSettleBal', key: 'tSettleBal' },
      { title: '本批可结算金额', dataIndex: 'aSettleBalMax', key: 'aSettleBalMax' },
      { title: '本批结算日期', dataIndex: 'aSettleDateMax', key: 'aSettleDateMax' },
      { title: '更新日期', width: 120, dataIndex: 'timeUpdate', key: 'timeUpdate' },
      { title: '操作',
        key: 'operation',
        width: 135,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editDrawer(record)}}>资金划拨</a>
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
          initMapId,
          hostMapId,
          tTransAmt,
          tSettleAmt,
          tSettleBal ,
          aSettleBal1,
          aSettleDate1,
          aSettleBal2,
          aSettleDate2,
          aSettleBal3,
          aSettleDate3,
          aSettleBal4,
          aSettleDate4,
          aSettleBal5,
          aSettleDate5,
          aSettleBal6,
          aSettleDate6,
          dataReserve,
          timeUpdate,
          timeCreate,
          instName,
          hostName,
          settleFee
        } = item

        let aSettleBalMax = aSettleBal1
        let aSettleDateMax = aSettleDate1
        if (aSettleDateMax < aSettleDate2) {
          aSettleBalMax = aSettleBal2
          aSettleDateMax = aSettleDate2
        }
        if (aSettleDateMax < aSettleDate3) {
          aSettleBalMax = aSettleBal3
          aSettleDateMax = aSettleDate3
        }
        if (aSettleDateMax < aSettleDate4) {
          aSettleBalMax = aSettleBal4
          aSettleDateMax = aSettleDate4
        }
        if (aSettleDateMax < aSettleDate5) {
          aSettleBalMax = aSettleBal5
          aSettleDateMax = aSettleDate5
        }
        if (aSettleDateMax < aSettleDate6) {
          aSettleBalMax = aSettleBal6
          aSettleDateMax = aSettleDate6
        }

        return {
          key: idx,
          id,
          initMapId,
          hostMapId,
          tTransAmt,
          tSettleAmt,
          tSettleBal: covertMoney2Yuan(tSettleBal),
          aSettleBal1,
          aSettleDate1,
          aSettleBal2,
          aSettleDate2,
          aSettleBal3,
          aSettleDate3,
          aSettleBal4,
          aSettleDate4,
          aSettleBal5,
          aSettleDate5,
          aSettleBal6,
          aSettleDate6,
          dataReserve,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
          instName,
          hostName,
          aSettleBalMax: covertMoney2Yuan(aSettleBalMax),
          aSettleDateMax,
          settleFee: covertMoney2Yuan(settleFee),
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 通道结算管理
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