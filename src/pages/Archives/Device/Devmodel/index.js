import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from "antd";
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import DevBrandSelect from '@/components/TKDevBrandSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';

const FormItem = Form.Item;
const modelStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'},
  {key: 9, value: '注销'}
]
const modelTypeSelect = [
  {key: 0, value: 'POS'},
  {key: 1, value: '收银机'},
  {key: 2, value: '自助机'}
]

const modelPinpadSelect = [
  {key: -1, value: '无'},
  {key: 0, value: '集成'},
]

const modelPrinterSelect = [
  {key: -1, value: '无'},
  {key: 0, value: '集成'},
]
const namespace = 'devmodel';
@connect(({ devmodel, loading }) => ({
  result: devmodel.data,
  resultLoading: loading.effects['devmodel/search'] ? true : false
}))
@Form.create()

export default class Devmodel extends Component {
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
      const { devBrandMapId } = fieldsValue
      const values = {
        devBrandMapId
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
          <span className="span">品牌 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('devBrandMapId')(
              <DevBrandSelect placeholder='请选择品牌'/>
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
      { title: '型号代码', width: 120, dataIndex: 'modelCode', key: 'modelCode' },
      { title: '品牌', width: 120, dataIndex: 'devbrandName', key: 'devbrandName' },
      { title: '型号分类', width: 120, dataIndex: 'modelTypeText', key: 'modelTypeText' },
      { title: '密码键盘', width: 120, dataIndex: 'modelPinpadText', key: 'modelPinpadText' },
      { title: '打印机', width: 120, dataIndex: 'modelPrinterText', key: 'modelPrinterText' },
      { title: '状态', dataIndex: 'modelStatusText', key: 'modelStatus' },
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
          devbrandMapId,
          devbrandName,
          modelCode,
          modelStatus,
          modelType,
          modelPinpad,
          modelPrinter,
          modelPrice1,
          modelPrice2,
          dataReserve,
          timeUpdate,
          timeCreate,
        } = item

        return {
          key: idx,
          id,
          devbrandMapId,
          devbrandName,
          modelCode,
          modelStatus,
          modelStatusText: getObjStatus(modelStatusSelect, modelStatus),
          modelType,
          modelTypeText: getObjStatus(modelTypeSelect, modelType),
          modelPinpad,
          modelPinpadText: getObjStatus(modelPinpadSelect, modelPinpad),
          modelPrinter,
          modelPrinterText: getObjStatus(modelPrinterSelect, modelPrinter),
          modelPrice1,
          modelPrice2,
          dataReserve,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 设备型号
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>添加</Button>}
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
          width={'30%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage detailData={detailData}/>
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