import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Form, Input, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import { connect } from 'dva';
import { formatTime, getObjStatus, responseMsg, getOrgStr } from '@/utils/utils';
import styles from '../TableList.less';
import EditPage from './EditPage';
import DetailPage from './DetailPage';
import SetPage from './SetPage';

const FormItem = Form.Item;
const flagStatusSelect = [
  { key: 0, value: '正常' },
  { key: 1, value: '暂停' }
]

const portalIdSelect = [
  { key: 1, value: '平台' },
  { key: 2, value: '机构' },
  { key: 3, value: '渠道' },
  { key: 4, value: '商户' },
  { key: 5, value: '门店' }
]
const namespace = 'role';

@connect(({ role, loading }) => ({
  result: role.data,
  detailRes: role.detailRes,
  loading: loading.effects['role/search'] ? true : false,
}))
@Form.create()

export default class Item extends Component {
  state = {
    searchParam: {},
    detailData: null,
    detailVisible: false,
    editVisible: false,
    setVisible: false,
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
      
      const values = {
        ...fieldsValue
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
          <span className="span">角色编号 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('roleMapId')(<Input placeholder="请输入角色编号" />)}
          </FormItem>
        </div>
        <div className="kuai">
          <span className="span">角色名称 :</span>
          <FormItem className="inputW160">
            {getFieldDecorator('roleName')(<Input placeholder="请输入角色名称" />)}
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
      roleMapId: e.roleMapId
    }
    dispatch({
      type: `${namespace}/del`,
      payload: queryParam,
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            responseMsg(res)
            this.searchList()
          } else {
            responseMsg(res)
          }
        }
      }
    });
  };

  //获取详情
  getRoleAuthDetail = (e) => {
    const { dispatch } = this.props;

    let queryParam = {
      roleMapId: e.roleMapId
    }
    dispatch({
      type: `${namespace}/detail`,
      payload: queryParam
    }).then(()=>{
      let pdata = this.props.detailRes
      this.setState(
        {
          detailData: pdata,
        }
      )
    })
  }

  detailDrawer = (res = '') => {
    const { detailVisible } = this.state;
    this.setState({
      detailVisible: !detailVisible,
      detailData: !detailVisible ? res : ''
    })
  }
  editDrawer = (res = '') => {
    const { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      detailData: !editVisible ? res : ''
    })
  }

  setDrawer = (res = '') => {
    const { dispatch } = this.props;
    const { setVisible } = this.state;
    if (!setVisible) {
      let queryParam = {
        roleMapId: res.roleMapId
      }
      dispatch({
        type: `${namespace}/detail`,
        payload: queryParam
      }).then(()=>{
        let pdata = this.props.detailRes
        this.setState(
          {
            detailData: pdata,
            setVisible: !setVisible,
          }
        )
      })
    }else{
      this.setState(
        {
          detailData: '',
          setVisible: !setVisible
        }
      )
    }
  }
  render() {
    const columns = [
      { title: '角色编号', width: '8%', dataIndex: 'roleMapId', key: 'roleMapId' },
      { title: '角色名称', width: '10%', dataIndex: 'roleName', key: 'roleName' },
      { title: '归属', width: '15%', dataIndex: 'orgName', key: 'orgName' },
      { title: '适用', width: '10%', dataIndex: 'portalIdName', key: 'portalIdName' },
      { title: '状态', width: '8%', dataIndex: 'flagStatusName', key: 'flagStatusName' },
      { title: '创建时间', width: '15%', dataIndex: 'timeCreate', key: 'timeCreate' },
      {
        title: '操作',
        key: 'operation',
        width: '25%',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.editDrawer(record) }}>修改</a>
            <Divider type="vertical" />
            <a onClick={() => { this.setDrawer(record) }}>设置权限</a>
            {/* <Divider type="vertical" />
            <Popconfirm placement="topRight" title="你确定要执行此操作吗?" onConfirm={() => { this.handleDel(record) }}>
              <a>删除</a>
            </Popconfirm> */}
          </Fragment>
        ),
      },
    ];

    const {result, loading} = this.props
    const {detailData, detailVisible, editVisible, setVisible, queryParam} = this.state
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
          roleMapId,
          instMapId,
          instName,
          partnerMapIdP,
          partnerMapId,
          partnerNameP,
          partnerName,
          merMapIdP,
          merMapId,
          shopMapId,
          portalId,
          roleName,
          menuAccess,
          flagStatus,
          dataReserve,
          timeUpdate,
          timeCreate,
        } = item

        return {
          key: idx,
          roleMapId,
          instMapId,
          partnerMapIdP,
          partnerMapId,
          merMapIdP,
          merMapId,
          shopMapId,
          instName,
          partnerNameP,
          partnerName,
          portalId,
          roleName,
          orgName: getOrgStr(item),
          menuAccess,
          flagStatus,
          dataReserve,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),

          flagStatusName: getObjStatus(flagStatusSelect, flagStatus),
          portalIdName: getObjStatus(portalIdSelect, portalId),
    
        }
      })
    }
    return (
      <div>
        <Row key={'a'} style={{ marginBottom: '15px' }}>
          <Card className={styles.tableListForm}>
            <div>{this.renderSearchForm()}</div>
          </Card>
        </Row>
        <Card key={'b'}
          className={styles.tableListTitle}
          title={<span className={styles.tableTitle}><Icon type="appstore-o" /> 角色列表
                    <span className="pagenum"> (共 {tablePagination.total} 条记录)</span>
          </span>}
          extra={<Button type="primary" onClick={() => { this.editDrawer() }}>添加</Button>}
        >
          <Table
            loading={loading}
            bordered
            columns={columns}
            dataSource={tableData}
            size='small'
            scroll={{ x: 800 }}
            pagination={tablePagination}
          />
        </Card>
        <Drawer
          title="详情"
          placement="right"
          width={'24%'}
          destroyOnClose={true}
          onClose={this.detailDrawer}
          visible={detailVisible}
        >
          <DetailPage detailData={detailData} />
        </Drawer>

        <Drawer
          title={detailData ? '编辑 - '+detailData.roleName : '添加'}
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
              () => {
                this.searchList()
                this.editDrawer()
              }
            }
          />
        </Drawer>

        <Drawer
          title={"设置权限" + (detailData ? ' - '+detailData.roleName : '')}
          placement="right"
          width={'30%'}
          destroyOnClose={true}
          onClose={this.setDrawer}
          visible={setVisible}
          maskClosable={false}
          style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
          }}
        >
          <SetPage
            detailData={detailData}
            onClose={this.setDrawer}
            onReturnList={
              () => {
                this.searchList()
                this.setDrawer()
              }
            }
          />
        </Drawer>
      </div>
    );
  }
}