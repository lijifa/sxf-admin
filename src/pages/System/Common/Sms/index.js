import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Drawer, Spin, DatePicker, Divider } from 'antd';
import { connect } from 'dva';
import {formatTime, covertMoney2Yuan, responseMsg} from '@/utils/utils';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const namespace = 'sms';

@connect(({ sms, loading }) => ({
  result: sms.data,
  loading: loading.effects['sms/search'] ? true : false,
}))
@Form.create()

export default class Sys extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    isExpandRows: false,
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

  componentWillMount () {
    this.setState({
      isExpandRows: true
    })
  }

test () {
  const {isExpandRows } = this.state
  this.setState({
    isExpandRows: !isExpandRows
  })
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

      const {id, skuGrpId, spuName} = fieldsValue
      const values = {
        id,
        skuGrpId,
        spuName
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
          <span className="span">短信时间 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('spuName')(
              <RangePicker style={{width: '220px'}}/>
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
  render() {
    const { detailData, detailVisible, editVisible, queryParam } = this.state
    const { result, loading } = this.props
    const columns = [
      { title: '归属机构', width: 130, dataIndex: 'instMapId', key: 'instMapId', fixed: 'left' },
      { title: '手机号', width: 130, dataIndex: 'userMobile', key: 'userMobile' },
      { title: '内容', width: 210, dataIndex: 'smsDesc', key: 'smsDesc' },
      { title: '发送结果', width: 110, dataIndex: 'flagStatus', key: 'flagStatus' },
      { title: '时间', dataIndex: 'timeCreate', key: 'timeCreate' },
    ];

    const listData = result || {}
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
          userMobile,
          instMapId,
          smsDesc,
          smsCheck,
          flagStatus,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          userMobile,
          instMapId,
          smsDesc,
          smsCheck,
          flagStatus,
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
          title={<span className={styles.tableTitle} onClick={()=>this.test()}><Icon type="appstore-o" /> 短信流水
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
                  </span>}
        >
          <Spin spinning={loading}>
            <Table
              bordered
              columns={columns}
              dataSource={tableData}
              size='small'
              scroll={{x: 800}}
              pagination={tablePagination}
            />
          </Spin>
        </Card>
        <Drawer
          title="详情"
          placement="right"
          width={'50%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

        <Drawer
          title={detailData ? '编辑' : '添加'}
          placement="right"
          width={'50%'}
          destroyOnClose={true}
          onClose={this.editDrawer}
          visible={editVisible}
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