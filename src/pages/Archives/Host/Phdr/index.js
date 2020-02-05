import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import TKInstitudeSelect from '@/components/TKInstitudeSelect';
import TKHostSelect from '@/components/TKHostSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import AddPage from './AddPage';
import DetailPage from './DetailPage';
const cardCdSelect = [
  {key: 0, value: '借记卡'},
  {key: 1, value: '贷记卡'},
  {key: 9, value: '非银行卡'}
]
const FormItem = Form.Item;
const namespace = 'phdr';
@connect(({ phdr, loading }) => ({
  result: phdr.data,
  loading: loading.effects['phdr/search'] ? true : false,
}))
@Form.create()

export default class Coin extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    addVisible: false,

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
      const { instMapId, hostMapId } = fieldsValue
      const values = {
        instMapId,
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
          <span className="span">归属机构 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('instMapId')(
              <TKInstitudeSelect 
                placeholder='请选择归属机构'
              />
            )}
          </FormItem>
        </div>

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

  //添加
  addDrawer = (res='') =>{
    const { addVisible } = this.state;
    this.setState({
      addVisible: !addVisible,
      detailData: !addVisible ? res : ''
    })
  }
  render() {
    const {detailData, queryParam} = this.state
    const columns = [
      { title: '通道编号', dataIndex: 'hostMapId', key: 'hostMapId' },
      { title: '通道名称', dataIndex: 'hostName', key: 'hostName' },
      { title: '支付方式', dataIndex: 'paytypeName', key: 'paytypeName' },
      { title: '扣率', dataIndex: 'mdrPerFee', key: 'mdrPerFee' },
      { title: '创建时间', width: 120, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            <a onClick={()=>{this.editDrawer(record)}}>修改</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleDel(record)}}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const {result, loading} = this.props;
    const listData = result.data || {};
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
          hostMapId,
          paytypeMapId,
          mdrType,
          mdrPerFee,
          mdrFixFee,
          issPerFee,
          issFixFee,
          netPerFee,
          netFixFee,
          brandPerFee,
          brandFixFee,
          dataReserve,
          timeUpdate,
          timeCreate,
          hostName,
          paytypeName,
          cardCd,
          instHostCode,
          coinName,
          instName
        } = item

        return {
          key: idx,
          id,
          instMapId,
          hostMapId,
          paytypeMapId,
          mdrType,
          mdrPerFee,
          mdrFixFee,
          issPerFee,
          issFixFee,
          netPerFee,
          netFixFee,
          brandPerFee,
          brandFixFee,
          dataReserve,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
          hostName,
          paytypeName: paytypeName+ '【' + getObjStatus(cardCdSelect, cardCd)+'】',
          instHostCode,
          coinName,
          instName
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 通道扣率
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.addDrawer()}}>添加</Button>}
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
          title={'添加'}
          placement="right"
          width={'40%'}
          destroyOnClose={true}
          onClose={this.addDrawer}
          visible={this.state.addVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <AddPage
            detailData={detailData}
            onClose={this.addDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.addDrawer()
              }
            }
          />
        </Drawer>
        <Drawer
          title={'编辑'}
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