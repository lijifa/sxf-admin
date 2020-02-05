import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;

const namespace = 'coin';
const mapStateToProps = (state) => {
  const result = state[namespace].data;
  return {
    result
  };
};

@connect(mapStateToProps)

@Form.create()

export default class Coin extends Component {
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
      const {coinName} = fieldsValue
      const values = {
        coinName
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
          <span className="span">{formatMessage({ id: 'coin.coinName' })} :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('coinName')(
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinName' })} />
            )}
          </FormItem>
        </div>

        <div className="btnkuai">
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit">
              {formatMessage({ id: 'global.button.query' })}
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              {formatMessage({ id: 'global.button.resetting' })}
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
      { title: formatMessage({ id: 'coin.coinId' }), width: 120, dataIndex: 'coinId', key: 'coinId' },
      { title: formatMessage({ id: 'coin.coinCode' }), width: 120, dataIndex: 'coinCode', key: 'coinCode' },
      { title: formatMessage({ id: 'coin.coinName' }), width: 120, dataIndex: 'coinName', key: 'coinName' },
      { title: formatMessage({ id: 'coin.coinSymbol' }), width: 120, dataIndex: 'coinSymbol', key: 'coinSymbol' },
      { title: formatMessage({ id: 'coin.coinUnit' }), width: 120, dataIndex: 'coinUnit', key: 'coinUnit' },
      { title: formatMessage({ id: 'global.list.createTime' }), dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: formatMessage({ id: 'global.list.operation' }),
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.editDrawer(record)}}>{formatMessage({ id: 'global.list.edit' })}</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title={formatMessage({ id: 'global.delete.isok' })} onConfirm={()=>{this.handleDel(record)}}>
              <a>{formatMessage({ id: 'global.list.del' })}</a>
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
          coinId,
          coinName,
          coinCode,
          coinSymbol,
          coinUnit,
          coinPoint,
          timeUpdate,
          timeCreate,
        } = item

        return {
          key: idx,
          id,
          coinId,
          coinName,
          coinCode,
          coinSymbol,
          coinUnit,
          coinPoint,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> {formatMessage({ id: 'coin.coinList' })}
                    <span className="pagenum"> ( {tablePagination.total} {formatMessage({ id: 'global.list.notes' })})</span>
                  </span>}
          extra={<Button type="primary" onClick={()=>{this.editDrawer()}}>{formatMessage({ id: 'global.button.add' })}</Button>}
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
          title={formatMessage({ id: 'global.list.detail' })}
          placement="right"
          width={'30%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

        <Drawer
          title={detailData ? formatMessage({ id: 'global.list.edit' }) : formatMessage({ id: 'global.button.add' })}
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