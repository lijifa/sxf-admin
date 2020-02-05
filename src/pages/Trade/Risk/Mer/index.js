import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, Select } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;
const blackFlagSelect = [
  {key: 0, value: '白名单'},
  {key: 9, value: '黑名单'},
]
const namespace = 'mer';
@connect(({ mer, loading }) => ({
  result: mer.data,
  resultLoading: loading.effects['mer/search'] ? true : false
}))
@Form.create()

export default class Mer extends Component {
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
      const { blackFlag, merNo } = fieldsValue
      const values = {
        blackFlag,
        merNo
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
          <span className="span">名单标志 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('blackFlag')(
              <StatusSelect options={blackFlagSelect} placeholder='请选择名单标志'/>
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">商户编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merNo')(
              <Input placeholder='请输入商户编号'/>
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
      { title: '商户编号', dataIndex: 'merNo', key: 'merNo' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      { title: '标志', dataIndex: 'blackFlag_str', key: 'blackFlag_str' },
      { title: '备注', dataIndex: 'dataReserve', key: 'dataReserve' },
      { title: '创建时间', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            {/*<Divider type="vertical" />*/}
            {/*<a onClick={()=>{this.editDrawer(record)}}>修改</a>*/}
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
          merMapId,
          merNo,
          partnerMapIdP,
          partnerMapId,
          instMapId,
          merName,
          blackFlag,
          dataReserve,
          timeUpdate,
          timeCreate,
        } = item

        return {
          key: idx,
          id,
          merMapId,
          merNo,
          partnerMapIdP,
          partnerMapId,
          instMapId,
          merName,
          blackFlag,
          blackFlag_str: getObjStatus( blackFlagSelect, blackFlag),
          dataReserve,
          timeUpdate: formatTime(timeUpdate, 'YYYY-MM-DD HH:mm:ss'),
          timeCreate: formatTime(timeCreate, 'YYYY-MM-DD HH:mm:ss')
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 黑白名单商户
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