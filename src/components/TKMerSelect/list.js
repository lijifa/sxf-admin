import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Button, Table } from 'antd';
import { connect } from 'dva';
import { formatTime, getObjStatus } from '@/utils/utils';
import styles from './index.less';
const FormItem = Form.Item;
const checkStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '冻结'},
  {key: 2, value: '待审核'},
  {key: 9, value: '注销'}
]
const namespace = 'merchantinfo';
@connect(({ merchantinfo, loading }) => ({
  result: merchantinfo.data,
  loading: loading.effects['merchantinfo/search'] ? true : false,
}))
@Form.create()

export default class MerSearch extends Component {
  state = {
    detailData: null,
    editVisible: false,

    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {
        levelFlag: this.props.levelFlag || '',
        instMapId: this.props.instMapId || '',
        flagStatus: 0
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
  merSearchList = e => {
    e.preventDefault();
    const { form, levelFlag } = this.props;
    let oldQuery = this.state.queryParam
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        // levelFlag: levelFlag || '',
        // createTime: fieldsValue.createTime && fieldsValue.createTime.valueOf(),
      };

      this.setState({
        queryParam: Object.assign({}, oldQuery, {
          condition: values,
          pageNumber: 1
        })
      }, ()=>{this.searchList()});
    });
  };

  // deptSearchList = () => {
  //   this.searchList()
  // };

  /* 查询条件重置 */
  handleFormReset = () => {
    const { form, levelFlag } = this.props;
    form.resetFields();
    this.setState({
      queryParam: {
        pageNumber: 1,
        pageSize: 15,
        startDate: '',
        endDate: '',
        condition: {
          levelFlag: levelFlag || '',
          flagStatus: 0
        }
      }
    }, ()=>{this.searchList()});
  }


  queryChange (key, val, falg = false) {
    let oldQuery = this.state.queryParam
    if(falg){
      oldQuery.pageNumber = 1
      oldQuery.condition[key] = val
      this.setState({queryParam: oldQuery})
    } else {
      let tmpObj = {pageNumber: 1}
      tmpObj[key] = val
      this.setState({queryParam: Object.assign({}, oldQuery, tmpObj)})
    }
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" className="search">
        <div className="kuai" style={{textAlign: 'left'}}>
          <span className="span">商户名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merName')(
              <Input
                placeholder='请输入商户名称'
                onChange={event => this.queryChange('merName', event, true)}
              />
            )}
          </FormItem>
        </div>
        <div className="kuai" style={{textAlign: 'left'}}>
          <span className="span">商户编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('merNo')(
              <Input
                placeholder='请输入商户编号'
                onChange={event => this.queryChange('merNo', event, true)}
              />
            )}
          </FormItem>
        </div>
        <div>
          <span className={styles.submitButtons}>
            <Button type="primary" onClick={this.merSearchList}>
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

  editDrawer = (res = '') => {
    if(typeof this.props.onChoose === 'function'){
      this.props.onChoose(res)
    }
  }
  
  render() {
    const {queryParam} = this.state;
    const {result, loading} = this.props;
    const listData = result.data || {};

    const columns = [
      { title: '商户编号', width: 160, dataIndex: 'merMapId', key: 'merMapId' },
      { title: '商户名称', dataIndex: 'merName', key: 'merName' },
      { title: '状态', width: 80, dataIndex: 'flagStatusText', key: 'flagStatusText' },
      { title: '创建时间', width: 110, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.editDrawer(record) }}>选择</a>
          </Fragment>
        ),
      },
    ];

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
          changType,
          changeOrder,
          flagStatus,
          checkType,
          commCityCountyName,
          commCityName,
          commCityProvName,
          instMapId,
          merMapId,
          merMapIdP,
          merName,
          merNo,
          merNameEn,
          partnerMapId,
          partnerMapIdP,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          changType,
          changeOrder,
          flagStatus,
          flagStatusText: getObjStatus(checkStatusSelect, flagStatus),
          checkType,
          commCityCountyName,
          commCityName,
          commCityProvName,
          instMapId,
          merMapId,
          merMapIdP,
          merName,
          merNo,
          merNameEn,
          partnerMapId,
          partnerMapIdP,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate)
        }
      })
    }
    return (
      <div>
        <Row style={{ marginBottom: '15px' }}>
          <Card key={'a'} className={styles.tableListForm}>
            <div>{this.renderSearchForm()}</div>
          </Card>
        </Row>
        <Table
          loading={loading}
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={tablePagination}
          size='small'
          scroll={{y: 260}}
        />
      </div>
    );
  }
}