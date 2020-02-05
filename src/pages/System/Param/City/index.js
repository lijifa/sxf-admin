import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import CitySelect from '@/components/TKCitySelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const namespace = 'city';
const mapStateToProps = (state) => {
  const result = state[namespace].data;
  return {
    result
  };
};

@connect(mapStateToProps)

@Form.create()

export default class City extends Component {
  state = {
    detailData: null,
    detailVisible: false,
    editVisible: false,
    cityId: '',
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
      const {  cityId } = fieldsValue
      const values = {
        cityId
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
          <span className="span">{formatMessage({ id: 'city.cityName' })} :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('cityName')(
              <CitySelect placeholder={formatMessage({ id: 'global.select.choose' }) + formatMessage({ id: 'city.cityName' })} />
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
    const {detailData, detailVisible, editVisible, queryParam} = this.state
    const columns = [
      { title: formatMessage({ id: 'city.cityId' }), width: 120, dataIndex: 'cityId', key: 'cityId' },
      { title: formatMessage({ id: 'city.cityProvName' }), width: 120, dataIndex: 'cityProvName', key: 'cityProvName' },
      { title: formatMessage({ id: 'city.cityName' }), width: 120, dataIndex: 'cityName', key: 'cityName' },
      { title: formatMessage({ id: 'city.cityCounty' }), width: 120, dataIndex: 'cityCounty', key: 'cityCounty' },
      { title: formatMessage({ id: 'city.cityTel' }), width: 120, dataIndex: 'cityTel', key: 'cityTel' },
      { title: formatMessage({ id: 'city.cityZip' }), width: 120, dataIndex: 'cityZip', key: 'cityZip' },
      { title: formatMessage({ id: 'global.list.createTime' }), dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: formatMessage({ id: 'global.list.operation' }),
        key: 'operation',
        width: 180,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>{formatMessage({ id: 'global.list.detail' })}</a>
            <Divider type="vertical" />
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
          regionId,
          cityId,
          cityCounty,
          cityName,
          cityProvName,
          cityTel,
          cityZip,
          cityCcode,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          regionId,
          cityId,
          cityCounty,
          cityName,
          cityProvName,
          cityTel,
          cityZip,
          cityCcode,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> {formatMessage({ id: 'city.cityList' })}
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
          width={'36%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={detailVisible}
        >
          <DetailPage detailData={detailData}/>
        </Drawer>

        <Drawer
          title={detailData ? formatMessage({ id: 'global.list.edit' }) : formatMessage({ id: 'global.button.add' })}
          placement="right"
          width={'30%'}
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