import React, { Component } from 'react'
import { connect } from 'dva';
import { Spin, Cascader } from 'antd'
//import findIndex from 'lodash/findIndex';
const namespace = 'mcc';

@connect(({ mcc, loading }) => ({
  result: mcc.selectData,
  loading: loading.effects['mcc/queryAll'] ? true : false,
}))

export default class LazyOptions extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    mccOption: [],
    isInitialization: true,
  };

  componentDidMount() {
    this.queryMccp()
  }

  // 获取数据
  queryMccp = () => {
    const { dispatch, lv } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            this.setState({
              mccOption: res.data.map(item => {
                const { mccName, mccId } = item
                return {label: mccName, value: mccName, isLeaf: (lv == 1) ? true : false, mccId: mccId, key: mccId, zIdx: 1}
              })
            })
          }
        }
      }
    });
  }

  // 获取子级数据
  queryMcc = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const { dispatch } = this.props
    let isParent = targetOption.zIdx == 1

    let secondOption = {loading: false, value: ''}
    let thirdOption = {loading: false, value: ''}
    let mccId = ''
    if (isParent) {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      mccId = secondOption.mccId
    } else {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      thirdOption = selectedOptions[selectedOptions.length - 1]
      thirdOption.loading = true

      mccId = thirdOption.mccId
    }

    dispatch({
      type: `${namespace}/queryAll`,
      payload: {mccId: mccId},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            secondOption.loading = false
            thirdOption.loading = false
            if (isParent) {
              targetOption.children = res.data.map(item => {
                const { mccName, mccId } = item
                return { label: mccName, value: mccName, mccId: mccId, isLeaf: true, key:mccId }
              })
            } else {
              targetOption.children = res.data.map(item => {
                const { mccName, mccId, mccIdP } = item
                return { label: mccName, value: mccName, mccId: mccId, mccIdP: mccIdP, isLeaf: true, key:mccId  }
              })
            }

            this.setState({mccOption: [...this.state.mccOption]})
          }
        }
      }
    });
  }

  // displayRender = (label, selectedOptions) => {
  //   let initialValue = this.props['data-__meta'] ? this.props['data-__meta'].initialValue : []

  //   if (this.state.isInitialization && selectedOptions.length == 1 && initialValue.length > 0) {
  //     return initialValue.join(' / ')
  //   }
  //   return label.join(' / ')
  // }

  displayRender = (label, selectedOptions) => {
    let editVal = this.props.editValue
    let initialValue = editVal ? editVal : []
    if (this.state.isInitialization && initialValue.length > 0) {
      return initialValue.join(' / ')
    }
    return label.join(' / ')
  }

  onChange = (value, selectedOptions) => {
    if (this.state.isInitialization) {
      this.setState({isInitialization: false})
    }

    let result = []
    for (var idx in selectedOptions) {
      const { mccId, label, isLeaf, mccIdP } = selectedOptions[idx]
      result.push({id: mccId, name: label, mccIdP: mccIdP, isLeaf: isLeaf})
    }

    if (result.length < 1) {
      return
    }
    let lastData = result.slice(-1)

    if (typeof this.props.onChange === 'function') {
      if (this.props.allData) {
        this.props.onChange(result)
      }else{
        this.props.onChange(lastData[0].id)
      }
    }
  }

  // render() {
  //  let decoratorData = this.props['data-__meta']
  //   const { placeholder, zzdStyle, className, defaultValue} = this.props
  //   const { mccOption } = this.state

  //   return(
  //     <Cascader
  //       onChange = {this.onChange}
  //       options={mccOption}
  //       loadData={this.queryMcc}
  //       placeholder={placeholder}
  //       style={ zzdStyle }
  //       className={className}
  //       displayRender={this.displayRender}
  //       defaultValue={ decoratorData ? decoratorData.initialValue : defaultValue }
  //       changeOnSelect
  //     />
  //   )
  // }

  render() {
    let decoratorData = this.props['data-__meta']
     const { placeholder, zzdStyle, className, defaultValue, editValue} = this.props
     const { mccOption } = this.state
     return(
       <Cascader
        onChange = {this.onChange}
        options={mccOption}
        loadData={this.queryMcc}
        placeholder={editValue ? '' : placeholder}
        style={ zzdStyle }
        className={className}
        displayRender={this.displayRender}
        defaultValue={ decoratorData ? decoratorData.initialValue : defaultValue }
        changeOnSelect
      />
    )
   }
}