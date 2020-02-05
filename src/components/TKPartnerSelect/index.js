import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'partner';

@connect(({ partner, loading }) => ({
  result: partner.selectData,
  loading: loading.effects['partner/queryAll'] ? true : false,
}))

export default class TKPartnerSelect extends Component {
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
      payload: {
        partnerLevel: 1,
        flagStatus: 0,
      }
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
          <Option value={0} key={0} > 无 </Option>
          {
            options.map( (item) => {
              return <Option value={item.partnerMapId} key={item.partnerMapId} >{item.partnerName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}