import React, { Component } from 'react'
import { connect } from 'dva';
import { Spin, Cascader } from 'antd'
const namespace = 'devmodel';

@connect(({ devmodel, loading }) => ({
  result: devmodel.selectData,
  loading: loading.effects['devmodel/queryAll'] ? true : false,
}))

export default class LazyOptions extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    typeOption: [],
    isInitialization: true
  };

  componentDidMount() {
    this.queryBevbrand()
  }

  // 获取机构数据
  queryBevbrand = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `devbrand/queryAllNow`,
      payload: {devbrandStatus: 0},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            this.setState({
              typeOption: res.data.map(item => {
                const { devbrandName, devbrandMapId } = item
                return {
                  label: devbrandName,
                  value: devbrandName,
                  isLeaf: false,
                  id: devbrandMapId,
                  key: devbrandMapId,
                  zIdx: 1,
                }
              })
            })
          }
        }
      }
    });
  }

  queryDevmodel = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const { dispatch } = this.props
    //let isParent = targetOption.zIdx == 1

    let secondOption = {loading: false, value: ''}
    let queryParam = {}
    secondOption = selectedOptions[0]
    secondOption.loading = true

    queryParam = {
      devbrandMapId: secondOption.id,
      modelStatus: 0,
    }
    dispatch({
      type: `${namespace}/queryAllNow`,
      payload: queryParam,
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            secondOption.loading = false
            targetOption.children = res.data.map(item => {
              const { modelCode, id } = item
              return {
                label: modelCode,
                value: modelCode,
                isLeaf: true,
                id: modelCode,
                key: id
              }
            })

            this.setState({typeOption: [...this.state.typeOption]})
          }
        }
      }
    });
  }

  displayRender = (label, selectedOptions) => {
    let editVal = this.props.editValue
    let initialValue = editVal ? editVal : []
    if (this.state.isInitialization && selectedOptions.length == 1 && initialValue.length > 0) {
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
      const { id, label, isLeaf } = selectedOptions[idx]
      result.push({id: id, name: label, isLeaf: isLeaf})
    }
    
    if (typeof this.props.onChange === 'function') {
      if (this.props.allData) {
        this.props.onChange(result)
      }else{
        this.props.onChange(result.length > 0 ? result.pop().id : '')
      }
    }
  }

  render() {
   let decoratorData = this.props['data-__meta']
    const { placeholder, zzdStyle, className, defaultValue, editValue} = this.props
    const { typeOption } = this.state

    return(
      <Cascader
        onChange = {this.onChange}
        options={typeOption}
        loadData={this.queryDevmodel}
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