import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Radio, Divider } from 'antd';
import {covertMoney2Yuan, getObjStatus} from '@/utils/utils';
import styles from './styles.less';
const settleTSelect =  [
  {key: 0, value: 'T+1(工作日次日)'},
  {key: 1, value: 'T+2(工作日次日)'}
]
const settleFlagSelect =  [
  {key: 0, value: '独立结算'},
  {key: 2, value: '归集到上级'}
]
const acctTypeSelect =  [
  {key: 0, value: '对公收款账户'},
  {key: 1, value: '对私法人账号'}
]
const namespace = 'bank';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditBankPage extends Component {
  state = {
    acctType: 0,
    settleBankBid1: '0',   //联行代码(最大长度:20)对公	
    settleBidName1:'-',    //开户银行(最大长度:250)对公	
    settleBankId1: '0',    //银行代码(最大长度:11)对公	
    settleBankName1:'-',   //银行名称(最大长度:32)对公

    settleBankBid2: '0',   //联行代码(最大长度:20)对私	
    settleBidName2: '-',   //开户银行(最大长度:250)对私	
    settleBankId2: '0',    //银行代码(最大长度:11)对私	
    settleBankName2: '-',  //银行名称(最大长度:32)对私
  }

  // componentDidMount() {
  //   const { detailData } = this.props;
  //   this.setState({
  //     settleBankBid1: detailData ? detailData.settleBankBid1 :  '0',   //联行代码(最大长度:20)对公	
  //     settleBidName1: detailData ? detailData.settleBidName1 : '-',   //开户银行(最大长度:250)对公	
  //     settleBankId1: detailData ? detailData.settleBankId1 : '0',     //银行代码(最大长度:11)对公	
  //     settleBankName1: detailData ? detailData.settleBankName1 : '-', //银行名称(最大长度:32)对公

  //     settleBankBid2: detailData ? detailData.settleBankBid2 :  '0',   //联行代码(最大长度:20)对私	
  //     settleBidName2: detailData ? detailData.settleBidName2 : '-',   //开户银行(最大长度:250)对私	
  //     settleBankId2: detailData ? detailData.settleBankId2 : '0',    //银行代码(最大长度:11)对私	
  //     settleBankName2: detailData ? detailData.settleBankName2 : '-',  //银行名称(最大长度:32)对私

  //     acctType: detailData ? detailData.settleAcctType : '0'
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 2 ) {
      this.setState({
        settleBankBid1: detailData ? detailData.settleBankBid1 :  '0',   //联行代码(最大长度:20)对公	
        settleBidName1: detailData ? detailData.settleBidName1 : '-',   //开户银行(最大长度:250)对公	
        settleBankId1: detailData ? detailData.settleBankId1 : '0',     //银行代码(最大长度:11)对公	
        settleBankName1: detailData ? detailData.settleBankName1 : '-', //银行名称(最大长度:32)对公

        settleBankBid2: detailData ? detailData.settleBankBid2 :  '0',   //联行代码(最大长度:20)对私	
        settleBidName2: detailData ? detailData.settleBidName2 : '-',   //开户银行(最大长度:250)对私	
        settleBankId2: detailData ? detailData.settleBankId2 : '0',    //银行代码(最大长度:11)对私	
        settleBankName2: detailData ? detailData.settleBankName2 : '-',  //银行名称(最大长度:32)对私

        acctType: detailData ? detailData.settleAcctType : '0'
      })
    }
  }

  //获取银行联行信息数据
  getBankData = (data,  flag=0) => {
    if (flag == 0) {
      this.setState({
        //settleAcctName1,  //账户户名(最大长度:120)对公	
        //settleAcctNo1: '',    //结算账号(最大长度:60)对公	
        settleBankBid1: data.bankBid,   //联行代码(最大长度:20)对公	
        settleBidName1: data.bidName,    //开户银行(最大长度:250)对公	
        settleBankId1: data.bankId,    //银行代码(最大长度:11)对公	
        settleBankName1: data.bidName,   //银行名称(最大长32)对公
      })
    }else{
      this.setState({
        //settleAcctName1,  //账户户名(最大长度:120)对公	
        //settleAcctNo1: '',    //结算账号(最大长度:60)对公	
        settleBankBid2: data.bankBid,   //联行代码(最大长度:20)对公	
        settleBidName2: data.bidName,    //开户银行(最大长度:250)对公	
        settleBankId2: data.bankId,    //银行代码(最大长度:11)对公	
        settleBankName2: data.bidName,   //银行名称(最大长32)对公
      })
    }
  }

  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(1, 'back')
  };
  
  handleSubmit = () => {
    const { clickNext } = this.props;
    clickNext(2)
  };

  render() {
    const {
      acctType,
      settleBidName1,    //开户银行(最大长度:250)对公
      settleBidName2,   //开户银行(最大长度:250)对私
    } = this.state;
    const { detailData } = this.props;
  
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }
    const isDisplay_1 = acctType == 0
    const isDisplay_2 = acctType == 1
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' style={{padding: '0 20px', marginBottom: '28px'}}>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>结算周期</p>
                <p style={detailText}>{getObjStatus(settleTSelect, detailData.settleT)}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>资金归集</p>
                <p style={detailText}>{getObjStatus(settleFlagSelect, detailData.settleFlag)}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>结算币种</p>
                <p style={detailText}>{detailData.coinName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>结算划拨最低金额</p>
                <p style={detailText}>{covertMoney2Yuan(detailData.settleTopAmt)} 元</p>
              </div>
            </Col>
            <Col span={16}>
              <div>
                <p style={detailTitle}>结算划拨最低金额（每笔）</p>
                <p style={detailText}>{covertMoney2Yuan(detailData.settleOffAmt)} 元</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <div>
                <p style={detailTitle}>账户类型</p>
                <p style={detailText}>{ getObjStatus(acctTypeSelect, detailData.settleAcctType)}</p>
              </div>
            </Col>
          </Row>
          <div style={{display: isDisplay_1 ? 'block' : 'none'}}>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>账户名称</p>
                  <p style={detailText}>{ detailData.settleAcctName1 }</p>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>账号</p>
                  <p style={detailText}>{ detailData.settleAcctNo1 }</p>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>开户银行</p>
                  <p style={detailText}>{ detailData.settleBidName1 }</p>
                </div>
              </Col>
            </Row>
          </div>
          <div style={{display: isDisplay_2 ? 'block' : 'none'}}>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>户名</p>
                  <p style={detailText}>{ detailData.settleAcctName2 }</p>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>卡号</p>
                  <p style={detailText}>{ detailData.settleAcctNo2}</p>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <div>
                  <p style={detailTitle}>开户银行</p>
                  <p style={detailText}>{ detailData.settleBidName2}</p>
                </div>
              </Col>
            </Row>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.props.onClose}
            >
              取消
            </Button>
            <Button style={{
                marginRight: 8,
              }} type="primary" onClick={this.onBackup}>上一步</Button>
            <Button type="primary" onClick={this.handleSubmit}>下一步</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditBankPage);
export default EditFormPage