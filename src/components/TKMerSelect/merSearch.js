import React, { Component, Fragment } from 'react'
import { Input, Modal } from 'antd'
import ListPage from './list';
const Search = Input.Search;

export default class TKBankSearch extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    searchModelVisible: false,
    merData: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deptreset == 'f') {
      this.setState({
        merData: ''
      })
    }
  }

  //搜索列表弹框
  searchModel = () => {
    this.setState({
      searchModelVisible: true,
    })
  }

  closeSearchModel = () => {
    this.setState({
      searchModelVisible: false,
    })
  }

  //弹窗后的选择后的回调
  callBackVal = (val) =>{
    this.setState({
      merData: val
    }, ()=>{
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(val.merMapId)
      }

      if (typeof this.props.getmore === 'function') {
        this.props.getmore(val)
      }

      this.closeSearchModel()
    })
  }

  //清除数据
  // clearDeptData = () => {
  //   if (typeof this.props.onChange === 'function') {
  //     this.props.onChange(val.merMapId)
  //   }
  // }
  
  render() {
    const {searchModelVisible, merData} = this.state
    const {merName, levelFlag} = this.props
 
    return(
      <Fragment>
        <Search
          placeholder="请选择商户"
          value={merData ? merData.merName : (merName ? merName : '')}
          onSearch={value => this.searchModel(value)}
          onClick={value => this.searchModel(value)}
        />
        
          <Modal
            title="选择商户"
            centered={true}
            visible={searchModelVisible}
            maskClosable={false}
            bodyStyle={{textAlign:'center'}}
            width={900}
            height={600}
            footer={null}
            onCancel={()=>{this.closeSearchModel()}}
          >
          <ListPage onClose={()=>this.closeSearchModel()} onChoose={(val)=>this.callBackVal(val)} levelFlag={levelFlag} instMapId={this.props.instMapId}/>
        </Modal>
      </Fragment>
    )
  }
}