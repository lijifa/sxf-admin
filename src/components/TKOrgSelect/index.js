import React, { Component } from 'react'
import { connect } from 'dva';
import { Spin, Cascader } from 'antd'
//import findIndex from 'lodash/findIndex';
const namespace = 'partner';

@connect(({  partner, loading }) => ({
  result: partner.selectData,
  loading: loading.effects['partner/queryAll'] ? true : false,
}))

export default class LazyOptions extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    orgOption: [],
    isInitialization: true,
    lvNum: 1
  };

  componentDidMount() {
    this.queryInst()
  }

  // 获取机构数据
  queryInst = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `institude/queryAllNow`,
      payload: {flagStatus: 0},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            this.setState({
              orgOption: res.data.map(item => {
                const { instName, instMapId } = item
                return {
                  label: instName,
                  value: instName,
                  isLeaf: false,
                  id: instMapId,
                  key: instMapId,
                  zIdx: 1,
                }
              })
            })
          }
        }
      }
    });
  }

  queryPartner = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const { dispatch } = this.props
    let isParent = targetOption.zIdx == 1

    let secondOption = {loading: false, value: ''}
    let thirdOption = {loading: false, value: ''}
    let queryParam = {}
    if (isParent) {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      queryParam = {
        instMapId: secondOption.id,
        partnerMapIdP: 0,
        flagStatus: 0,
      }
    } else {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      thirdOption = selectedOptions[selectedOptions.length - 1]
      thirdOption.loading = true
     
      queryParam = {
        partnerMapIdP: thirdOption.id,
        flagStatus: 0,
      }
    }

    dispatch({
      type: `${namespace}/queryAllNow`,
      payload: queryParam,
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            secondOption.loading = false
            thirdOption.loading = false
            if (isParent) {
              targetOption.children = res.data.map(item => {
                const { partnerName, partnerMapId } = item
                return {
                  label: partnerName,
                  value: partnerName,
                  isLeaf: false,
                  id: partnerMapId,
                  key: partnerMapId
                }
              })
            } else {
              if (res.data < 1) {
                thirdOption.isLeaf = true
                secondOption.loading = false
                thirdOption.loading = false
                //targetOption.children = []
                return
              }
              targetOption.children = res.data.map(item => {
                const { partnerName, partnerMapId } = item
                return {
                  label: partnerName,
                  value: partnerName,
                  isLeaf: true,
                  id: partnerMapId,
                  key: partnerMapId
                }
              })
            }

            this.setState({orgOption: [...this.state.orgOption]})
          }
        }
      }
    });
  }

  displayRender = (label, selectedOptions) => {
    let editVal = this.props.editValue
    let resetVal = this.props.resetVal
    if (resetVal == 't') {
      return []
    }
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
      const { id, label, isLeaf } = selectedOptions[idx]
      result.push({id: id, name: label, isLeaf: isLeaf})
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

  render() {
   let decoratorData = this.props['data-__meta']
    const { placeholder, zzdStyle, className, defaultValue, editValue} = this.props
    const { orgOption } = this.state
    return(
      <Cascader
        onChange = {this.onChange}
        options={orgOption}
        loadData={this.queryPartner}
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