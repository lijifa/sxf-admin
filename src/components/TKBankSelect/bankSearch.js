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
    bankData: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deptreset == 'f') {
      this.setState({
        bankData: ''
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
      bankData: val
    }, ()=>{
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(val.bankId)
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
  //     this.props.onChange(val.bankId)
  //   }
  // }
  
  render() {
    const {searchModelVisible, bankData} = this.state
    const {bidName, levelFlag} = this.props
 
    return(
      <Fragment>
        <Search
          placeholder="请选择银行"
          value={bankData ? bankData.bidName : (bidName ? bidName : '')}
          onSearch={value => this.searchModel(value)}
          onClick={value => this.searchModel(value)}
        />
        
        <Modal
          title="选择银行"
          centered={true}
          visible={searchModelVisible}
          maskClosable={false}
          bodyStyle={{textAlign:'center'}}
          width={800}
          height={500}
          footer={null}
          onCancel={()=>{this.closeSearchModel()}}
        >
          <ListPage onClose={()=>this.closeSearchModel()} onChoose={(val)=>this.callBackVal(val)} levelFlag={levelFlag}/>
        </Modal>
      </Fragment>
    )
  }
}