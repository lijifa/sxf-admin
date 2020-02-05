import React, { Component, Fragment } from 'react';
import { Row, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm, DatePicker } from 'antd';
import { connect } from 'dva';
import {formatTime, responseMsg, getObjStatus, changeTime, getOrgData} from '@/utils/utils';
import OrgSelect from '@/components/TKOrgSelect';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const checkStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '冻结'},
  {key: 2, value: '待审核'},
  {key: 9, value: '注销'}
]

const pLvSelect = [
  {key: 1, value: '一级'},
  {key: 2, value: '二级'}
]

const namespace = 'partnerinfo';
@connect(({ partnerinfo, loading }) => ({
  result: partnerinfo.data,
  loading: loading.effects['partnerinfo/search'] ? true : false,
}))

@Form.create()

export default class Partner extends Component {
  state = {
    detailId: null,
    detailVisible: false,
    editVisible: false,
    queryParam: {
      pageNumber: 1,
      pageSize: 15,
      startDate: '',
      endDate: '',
      resetVal: 'f',
      condition: {

      }
    }
  };

  componentDidMount() {
    this.searchList()
  }

  //获取组织数据
  onChangeOrg = (data) => {
    let orgData = getOrgData(data)
    let oldQuery = this.state.queryParam
    oldQuery.pageNumber = 1
    oldQuery.condition['instMapId'] = orgData.instMapId
    oldQuery.condition['partnerMapId'] = orgData.partnerMapId
    oldQuery.condition['partnerMapIdP'] = orgData.partnerMapIdP
    this.setState({queryParam: oldQuery})
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
      const {changeDate, partnerName} = fieldsValue
      let date= changeDate ? changeTime(changeDate[0], changeDate[1]) : ''
      const values = {
        partnerName
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
        resetVal: 't',
        condition: {}
      }
    }, ()=>{this.searchList()});
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { queryParam } = this.state
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className="search">
        <div className="kuai">
          <span className="span">渠道名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('partnerName')(
              <Input placeholder='请输入渠道名称' />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">归属 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('orgData')(
              <OrgSelect
                placeholder='请选择归属'
                allData={true}
                resetVal={queryParam.resetVal}
                onChange={(val) => this.onChangeOrg(val)}
              />
            )}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">变更日期 :</span>
          <FormItem className="inputW210">
            {getFieldDecorator('changeDate')(
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

  /* 撤销操作 */
  handleRevoke = e => {
    const { dispatch } = this.props;

    let queryParam = {
      partner: {
        id: e.id,
        flagStatus: e.flagStatus == 1 ? 0 : 1,
      }
    }
    dispatch({
      type: `${namespace}/update`,
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
      detailId: !detailVisible ? res.id : ''
    })
  }

  //编辑
  editDrawer = (res='') =>{
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailId: !editVisible ? res.id : ''
    })
  }
  render() {
    const {detailId, queryParam} = this.state
    const columns = [
      { title: '渠道编号', width: 160, dataIndex: 'partnerMapId', key: 'partnerMapId' },
      { title: '渠道名称', dataIndex: 'partnerName', key: 'partnerName' },
      // { title: '地址', width: 180, dataIndex: 'commAddress', key: 'commAddress' },
      { title: '级别', width: 100, dataIndex: 'partnerLevelText', key: 'partnerLevelText' },
      { title: '状态', width: 80, dataIndex: 'flagStatusText', key: 'flagStatusText' },
      { title: '创建时间', width: 110, dataIndex: 'timeCreate', key: 'timeCreate' },
      { title: '操作',
        key: 'operation',
        width: 150,
        fixed: 'right',
        render: (text, record) => (
          <Fragment>
            <a onClick={()=>{this.detailDrawer(record)}}>详情</a>
            <Divider type="vertical" />
            {record.flagStatus != 2 && record.flagStatus != 1 ? 
            <a onClick={()=>{this.editDrawer(record)}}>变更</a>
            : <a href="javascript:void(0)" style={{color: '#ccc'}}>变更</a>
            }
            <Divider type="vertical" />
            {record.flagStatus != 2 ? 
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={()=>{this.handleRevoke(record)}}>
              {record.flagStatus == 1 ? <a>解冻</a> : <a>冻结</a> }
            </Popconfirm>
            : <a href="javascript:void(0)" style={{color: '#ccc'}}>冻结</a>
            }
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
          partnerMapId,
          instMapId,
          partnerMapIdP,
          partnerName,
          partnerLevel,
          flagStatus,
          paytypeOpen,
          contractNo,
          contractExp,
          customLogo,
          customTitle,
          commRegionId,
          commCityId,
          commCityCountyName,
          commCityName,
          commCityProvName,
          commCityZip,
          commAddress,
          commMan,
          commMobile,
          commTel,
          commFax,
          commEmail,
          dataReserve,
          timeUpdate,
          timeCreate
        } = item

        return {
          key: idx,
          id,
          partnerMapId,
          instMapId,
          partnerMapIdP,
          partnerName,
          partnerLevel,
          partnerLevelText: getObjStatus(pLvSelect, partnerLevel),
          flagStatus,
          flagStatusText: getObjStatus(checkStatusSelect, flagStatus),
          paytypeOpen,
          contractNo,
          contractExp,
          customLogo,
          customTitle,
          commRegionId,
          commCityId,
          commCityCountyName,
          commCityName,
          commCityProvName,
          commCityZip,
          commAddress,
          commMan,
          commMobile,
          commTel,
          commFax,
          commEmail,
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
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 渠道信息
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
          width={'48%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={this.state.detailVisible}
        >
          <DetailPage
            detailId={detailId}
            onClose={this.detailDrawer}
          />
        </Drawer>

        <Drawer
          title={detailId ? '编辑' : '添加'}
          placement="right"
          width={'48%'}
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
            detailId={detailId}
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