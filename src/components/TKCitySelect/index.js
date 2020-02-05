import React, { Component } from 'react'
import { connect } from 'dva';
import { Spin, Cascader } from 'antd'
//import findIndex from 'lodash/findIndex';
const namespace = 'city';

@connect(({ city, loading }) => ({
  result: city.selectData,
  loading: loading.effects['city/queryAll'] ? true : false,
}))

export default class LazyOptions extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    cityOption: [],
    isInitialization: true,
    lvNum: 1
  };

  componentDidMount() {
    this.queryProv()
  }

  // 获取省数据
  queryProv = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {regionId: 156},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            this.setState({
              cityOption: res.data.map(item => {
                const { cityProvName, cityId, cityZip, regionId } = item
                return {
                  label: cityProvName,
                  value: cityProvName,
                  isLeaf: false,
                  cityId: cityId,
                  key: cityId,
                  zIdx: 1,
                  cityZip: cityZip,
                  regionId: regionId
                }
              })
            })
          }
        }
      }
    });
  }

  queryCity = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    const { dispatch } = this.props
    let isParent = targetOption.zIdx == 1

    let secondOption = {loading: false, value: ''}
    let thirdOption = {loading: false, value: ''}
    let cityId = ''
    if (isParent) {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      cityId = secondOption.cityId
    } else {
      secondOption = selectedOptions[0]
      secondOption.loading = true

      thirdOption = selectedOptions[selectedOptions.length - 1]
      thirdOption.loading = true
      
      cityId = thirdOption.cityId
    }

    dispatch({
      type: `${namespace}/queryAll`,
      payload: {regionId: 156, cityId: cityId},
      callback: (res) => {
        if (res) {
          if (res.code == '00') {
            secondOption.loading = false
            thirdOption.loading = false
            if (isParent) {
              targetOption.children = res.data.map(item => {
                const { cityName, cityId, cityZip, regionId } = item
                return {
                  label: cityName,
                  value: cityName,
                  cityId: cityId,
                  isLeaf: false,
                  key:cityId,
                  cityZip: cityZip,
                  regionId: regionId,
                }
              })
            } else {
              targetOption.children = res.data.map(item => {
                const { cityCounty, cityId, cityZip, regionId } = item
                return {
                  label: cityCounty,
                  value: cityCounty,
                  cityId: cityId,
                  isLeaf: true,
                  key:cityId,
                  cityZip: cityZip,
                  regionId: regionId,
                }
              })
            }

            this.setState({cityOption: [...this.state.cityOption]})
          }
        }
      }
    });
  }

  displayRender = (label, selectedOptions) => {
    let editVal = this.props.editValue
    let initialValue = this.props['data-__meta'] ? this.props['data-__meta'].initialValue : []

    if (this.state.isInitialization && selectedOptions.length == 1 && initialValue.length > 0) {
      return initialValue.join(' / ')
    }
    if (label.length > 0) {
      return label.join(' / ')
    }else{
      return editVal ? editVal.join(' / ') : label.join(' / ')
    }
  }

  onChange = (value, selectedOptions) => {
    if (this.state.isInitialization) {
      this.setState({isInitialization: false})
    }

    let result = []
    for (var idx in selectedOptions) {
      const { cityId, label, isLeaf, cityZip, regionId } = selectedOptions[idx]
      result.push({id: cityId, name: label, isLeaf: isLeaf, cityZip: cityZip, regionId: regionId})
    }

    if (typeof this.props.onChange === 'function') {
      if (this.props.allData) {
        this.props.onChange(result)
      }else{
        this.props.onChange(result.length > 0 ? result.pop().id : '')
      }
    }

    // if (typeof this.props.onChange === 'function') {
    //   if (this.props.onlyId) {
    //     this.props.onChange(result.pop().id) 
    //   }else{
    //     this.props.onChange(result)
    //   }
    // }
    
  }

  render() {
   let decoratorData = this.props['data-__meta']
    const { placeholder, zzdStyle, className, defaultValue, editValue} = this.props
    const { cityOption } = this.state

    return(
      <Cascader
          onChange = {this.onChange}
          options={cityOption}
          loadData={this.queryCity}
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