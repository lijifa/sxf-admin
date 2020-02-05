import React, { Component } from 'react'
import { connect } from 'dva';
import { Select, Spin } from 'antd'
const { Option } = Select
const namespace = 'riskrule';
const riskRuleTSelect = [
  {ruleId: 2001, ruleName: '大额交易指数'},
  {ruleId: 2002, ruleName: '低额交易比例指数'},
  {ruleId: 2003, ruleName: '整额交易比例指数'},
  {ruleId: 2004, ruleName: '手输交易比例指数'},
  {ruleId: 2005, ruleName: '退货交易比例指数'},
  {ruleId: 2006, ruleName: '调单比例指数'},
  {ruleId: 2007, ruleName: '退单比例指数'},
  {ruleId: 2008, ruleName: '非营业时间交易比例'},
  {ruleId: 2009, ruleName: '失败交易比例指数'},
  {ruleId: 2010, ruleName: '密码错误比例指数'},
  {ruleId: 2011, ruleName: '查余额比例'},
  {ruleId: 2012, ruleName: '最低消费金额'},
]
@connect(({ riskrule, loading }) => ({
  result: riskrule.selectSearchData,
  loading: loading.effects['riskrule/queryAllSearch'] ? true : false,
}))

export default class RiskrullSelect extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    instMapId: '',
  }
  componentDidMount() {
    this.searchList()
  }

  componentWillReceiveProps(nextProps) {
    const { instMapId } = nextProps;
    if ( instMapId && instMapId != this.props.instMapId ) {
      console.log('====instMapId====')
      console.log(instMapId)
      console.log('====instMapId====')
      this.setState({
        instMapId: instMapId,
      }, () => {
        this.searchList()
      })
    }
  }

  /* 列表初始化 */
  searchList() {
    const { dispatch } = this.props;
    const { instMapId } = this.state
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {
        instMapId: instMapId
      }
    });
  }

  onChangeSelect = (e, o) => {
    if (typeof this.props.onChange === 'function') {
      let returnData = {ruleId: o.props.value, ruleName: o.props.name}
      if (this.props.allData) {
        this.props.onChange(e, returnData)
      }else{
        this.props.onChange(e)
      }
    }
  }

  render() {
    const {result, loading, instMapId, isAll, ...others} = this.props

    let options = result ? result.data : []
    
    if (!instMapId) {
      options = riskRuleTSelect
    }
    
    if(options  === undefined || options.length==0)  {
      options = []
    }

    return(
      <Spin spinning={loading}>
        <Select
          {...this.props}
          allowClear={true}
          onChange={this.onChangeSelect}
        >
          {
            options.map( (item) => {
              return <Option value={item.ruleId} key={item.ruleId} name={item.ruleName} >{item.ruleName} </Option>
            })
          }
        </Select>
      </Spin>
    )
  }
}