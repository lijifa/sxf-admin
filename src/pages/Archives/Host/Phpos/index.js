import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatTime, responseMsg } from '@/utils/utils';
import TKInstitudeSelect from '@/components/TKInstitudeSelect';
import TKHostSelect from '@/components/TKHostSelect';
import styles from '../TableList.less';
import BaobeiPage from './BaobeiPage';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;

const namespace = 'phpos';
@connect(({ phpos, loading }) => ({
  result: phpos.data,
  loading: loading.effects['phpos/search'] ? true : false,
}))
@Form.create()

export default class Lang extends Component {

  state = {
    detailData: null,
    detailVisible: false,
    baobeiVisible: false,
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
      const { hostMapId, hostMerNo, merNo } = fieldsValue
      const values = {
        hostMapId,
        hostMerNo,
        merNo
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          condition: values,
          pageNumber: 1
        })
      }, ()=>{
        this.searchList()
      });
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

        <div className="kuai">
          <span className="span">平台商户编号:</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merNo')(
              <Input placeholder='请输入平台商户编号' />
            )}
          </FormItem>
        </div>
        
        <div className="kuai">
          <span className="span">报备商户编号:</span>
          <FormItem className="inputW160">
            {getFieldDecorator('hostMerNo')(
              <Input placeholder='请输入报备商户编号' />
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
      merNo: e.merNo,
      hostMapId: e.hostMapId,
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

  //报备
  baobeiDrawer = (res='') =>{
    const { baobeiVisible } = this.state;
    this.setState({
      baobeiVisible: !baobeiVisible,
      detailData: !baobeiVisible ? res : ''
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
      { title: '平台商户编号', dataIndex: 'merNo', key: 'merNo' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      { title: '报备通道', dataIndex: 'hostName', key: 'hostName' },
      { title: '报备商户编号', dataIndex: 'hostMerNo', key: 'hostMerNo' },
      { title: '终端数量', dataIndex: 'posTotalNum', key: 'posTotalNum' },
      { title: '报备数量', dataIndex: 'reportTotalNum', key: 'reportTotalNum' },
      { title: '创建时间', width: 120, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 195,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.baobeiDrawer(record)}}>报备</a>
            <Divider type="vertical" />
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

    const {result, loading} = this.props
    const listData = result.data || {}
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
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merNo,
          posNo,
          hostMapId,
          hostMerNo,
          hostPosNo,
          phposLoginFlag,
          phposBatch,
          phposTrace,
          hostKeyIndex,
          hostPosKey,
          dataReserve,
          timeUpdate,
          timeCreate,
          hostName,
          merName,
          merNameEn,
          posTotalNum,
          reportTotalNum
        } = item

        return {
          key: idx,
          id,
          instMapId,
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merNo,
          posNo,
          hostMapId,
          hostMerNo,
          hostPosNo,
          phposLoginFlag,
          phposBatch,
          phposTrace,
          hostKeyIndex,
          hostPosKey,
          dataReserve,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
          hostName,
          merName,
          merNameEn,
          posTotalNum,
          reportTotalNum
        }
      })
    }
    return (
      <Fragment>
        <Row style={{marginBottom:'15px'}}>
          <Card key={'a'} className={styles.tableListForm}>
            <div>{this.renderSearchForm()}</div>
          </Card>
        </Row>
        <Card key={'b'}
          className={styles.tableListTitle}
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 通道终端
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
          title="详情"
          placement="right"
          width={'50%'}
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
          title="报备"
          placement="right"
          width={'50%'}
          destroyOnClose={true}
          onClose={this.baobeiDrawer}
          visible={this.state.baobeiVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <BaobeiPage
            detailData={detailData}
            onClose={this.baobeiDrawer}
            onReturnList={
              ()=>{
                this.searchList()
                this.baobeiDrawer()
              }
            }
          />
        </Drawer>
        <Drawer
          title={detailData ? '编辑' : '添加'}
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
      </Fragment>
    );
  }
}