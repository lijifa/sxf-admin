import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'lang';

@connect(({ lang, loading }) => ({
  result: lang.selectData,
  loading: loading.effects['lang/queryAll'] ? true : false,
}))

export default class TKLangSelect extends Component {
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
              return <Option value={item.langCode} key={item.langCode} >{item.langName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}