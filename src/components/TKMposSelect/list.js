import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Button, Table } from 'antd';
import { connect } from 'dva';
import { formatTime, getObjStatus, getObjName } from '@/utils/utils';
import styles from './index.less';
const FormItem = Form.Item;
const namespace = 'phpos';
@connect(({ phpos, loading }) => ({
  result: phpos.data,
  resultBaobeilistData: phpos.baobeilistData,
  loading: loading.effects['phpos/baobeiquery'] ? true : false,
}))
@Form.create()

export default class BankSearch extends Component {
  state = {
    detailData: null,
    editVisible: false,
    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      condition: {
        merMapId: this.props.merMapId,
        posReportStatus: 0  //0未报备1已报备
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
      type: `${namespace}/baobeiquery`,
      payload: queryParam
    });
  }

  /* 查询操作 */
  // deptSearchList = e => {
  //   e.preventDefault();
  //   const { form, levelFlag } = this.props;
  //   let oldQuery = this.state.queryParam
  //   form.validateFields((err, fieldsValue) => {
  //     if (err) return;
  //     const values = {
  //       ...fieldsValue,
  //       levelFlag: levelFlag || '',
  //       createTime: fieldsValue.createTime && fieldsValue.createTime.valueOf(),
  //     };

  //     this.setState({
  //       queryParam: Object.assign({}, oldQuery, {
  //         condition: values,
  //         pageNumber: 1
  //       })
  //     }, ()=>{this.searchList()});
  //   });
  // };

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
          levelFlag: levelFlag || ''
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
      <Form onSubmit={this.handleSearch} layout="inline" className="search">
        {/* <div className="kuai" style={{textAlign: 'left'}}>
          <span className="span">语言语种 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('langCode')(
              <Input
                placeholder='请选择语言语种'
                onChange={event => this.queryChange('langCode', event.target.value, true)}
              />
            )}
          </FormItem>
        </div> */}

        <div className="kuai" style={{textAlign: 'left'}}>
          <span className="span">终端号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('posNo')(
              <Input
                placeholder='请输入终端号'
                onChange={event => this.queryChange('posNo', event, true)}
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

  editDrawer = (res = '') => {
    if(typeof this.props.onChoose === 'function'){
      this.props.onChoose(res)
    }
  }
  
  render() {
    const {queryParam} = this.state;
    const {resultBaobeilistData, loading} = this.props;
    const listData = resultBaobeilistData.data || {};

    const columns = [
      { title: '终端号', width: 200, dataIndex: 'posNo', key: 'posNo' },
      { title: '批次号', dataIndex: 'posBatch', key: 'posBatch' },
      { title: '流水号', dataIndex: 'posTrace', key: 'posTrace' },
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
          posMapId,
          posNo,
          posBatch,
          posTrace,
        } = item

        return {
          key: idx,
          id,
          posMapId,
          posNo,
          posBatch,
          posTrace
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