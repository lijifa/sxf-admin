import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Select, DatePicker, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
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
const namespace = 'notice';
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
      const {noticeDate, channelFlag} = fieldsValue
      let date= noticeDate ? changeTime(noticeDate[0], noticeDate[1]) : ''
      const values = {
        channelFlag
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
          <span className="span">通知日期 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('noticeDate')(<RangePicker />)}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">通知渠道 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('channelFlag')(<StatusSelect options={channelFlagSelect} placeholder="请选择通知渠道" />)}
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
    const {detailData} = this.state
    const columns = [
      { title: '编号', width: 120, dataIndex: 'id', key: 'id' },
      { title: '起始日期', width: 120, dataIndex: 'beginTime', key: 'beginTime' },
      { title: '结束日期', width: 120, dataIndex: 'endTime', key: 'endTime' },
      { title: '标题', dataIndex: 'noticeTitle', key: 'noticeTitle' },
      { title: '通知渠道', dataIndex: 'channelFlagName', key: 'channelFlagName' },
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
    }

    let tableData = null
    let list = listData.list
    if (list) {
      tableData = list.map((item, idx) => {
        const {
          id,
          orgMapId,
          operMapId,
          channelFlag,
          shopIds,
          beginTime,
          endTime,
          noticeTitle,
          noticeDesc,
          sendFlg,
          createTime,
          updateTime,
        } = item

        return {
          key: idx,
          id,
          orgMapId,
          operMapId,
          channelFlag,
          channelFlagName: getObjStatus(channelFlagSelect, channelFlag),
          shopIds,
          beginTime: formatTime(beginTime),
          endTime: formatTime(endTime),
          noticeTitle,
          noticeDesc,
          sendFlg,
          createTime: formatTime(createTime),
          updateTime: formatTime(updateTime)
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 通知列表
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>添加</Button>}
        >
          <Table
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{x: 800}} />
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