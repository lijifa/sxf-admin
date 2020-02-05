import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Select, DatePicker, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const channelFlagSelect =  [
  {key: 0, value: '全部'},
  {key: 1, value: '仅餐厅'},
  {key: 2, value: '仅OA'}
]
const namespace = 'holiday';
const mapStateToProps = (state) => {
  const result = state[namespace].data;
  return {
    result
  };
};

@connect(mapStateToProps)

@Form.create()

export default class Notice extends Component {
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
      const {instMapId, holidayDate} = fieldsValue
      let date= holidayDate ? changeTime(holidayDate[0], holidayDate[1]) : ''
      const values = {
        instMapId,
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          startDate: date ? date[0] : '',
          endDate: date ? date[1] : '',
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
          <FormItem className="inputW210">
            {getFieldDecorator('instMapId')(<InstitudeSelect placeholder="请选择归属机构" />)}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">节日假日 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('holidayDate')(<RangePicker />)}
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

  detailDrawer = (res='') =>{
    const { detailVisible } = this.state;
    this.setState({
      detailVisible: !detailVisible,
      detailData: !detailVisible ? res : ''
    })
  }
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
      { title: '归属机构', width: 120, dataIndex: 'instName', key: 'instName' },
      { title: '节日假日', width: 120, dataIndex: 'holidayDateSys', key: 'holidayDateSys' },
      { title: '清算日期', width: 120, dataIndex: 'settleDateSys', key: 'settleDateSys' },
      { title: '备注', dataIndex: 'dataReserve', key: 'dataReserve' },
      { title: '创建日期', dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 100,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.editDrawer(record)}}>修改</a>
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
          instName,
          holidayDateSys,
          settleDateSys,
          dataReserve,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          instMapId,
          instName,
          holidayDateSys,
          settleDateSys,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 节日假日列表
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
          width={'24%'}
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