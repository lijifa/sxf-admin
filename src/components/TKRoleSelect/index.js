import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'role';

@connect(({ role, loading }) => ({
  result: role.selectData,
  loading: loading.effects['role/queryAll'] ? true : false,
}))

export default class TKRoleSelect extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.searchList()
  }

  /* 列表初始化 */
  searchList() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  render() {
    const {result, loading, ...others} = this.props
    let options = result ? result.data : []
    if(options  === undefined || options.length==0)  {
      options = []
    }

    return(
      <Spin spinning={loading}>
        <Select {...this.props} allowClear={true}>
          {
            options.map( (item) => {
              return <Option value={item.roleMapId} key={item.roleMapId} >{item.roleName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}