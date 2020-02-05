import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Radio, Divider } from 'antd';
import {responseMsg, covertMoney, covertMoney2Yuan} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import CoinSelect from '@/components/TKCoinSelect';
import BankSearch from '@/components/TKBankSelect/bankSearch';
import styles from './styles.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group
const settleTSelect =  [
  {key: 0, value: 'T+1(工作日次日)'},
  {key: 1, value: 'T+2(工作日次日)'}
]

const settleFlagSelect =  [
  {key: '0', value: '独立结算'},
  {key: '2', value: '归集到上级'}
]
const namespace = 'partnerchange';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditBankPage extends Component {
  state = {
    isEdit: true,
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

  componentWillReceiveProps(nextProps) {
    const { isEdit } = this.state
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 2 && isEdit ) {
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
      },()=>{
        this.setState({
          isEdit: false
        })
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

  onChangeAcctType = (e) => {
    this.setState({
      acctType: e
    })
  }
  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(1, '', 'back')
  };
  
  handleSubmit = e => {
    e.preventDefault();

    const {
      acctType,
      settleBankBid1,   //联行代码(最大长度:20)对公	
      settleBidName1,   //开户银行(最大长度:250)对公	
      settleBankId1,    //银行代码(最大长度:11)对公	
      settleBankName1,

      settleBankBid2,   //联行代码(最大长度:20)对私
      settleBidName2,   //开户银行(最大长度:250)对私
      settleBankId2,    //银行代码(最大长度:11)对私
      settleBankName2
    } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { 
        coinId,	            //结算货币id(最大长度:11)	
        coinName,           //货币名称(最大长度:16)人民币	
        coinUnit,           //货币单位(最大长度:16)元USD
        settleFlag,         //资金归集(最大长度:1)0：独立结算2归集到上级，缺省0	
        //settleTType,      //结算周期(最大长度:1)‘T’、‘D’、’M’	
        settleT,            //结算周期(最大长度:11)天数T+nn>0；默认1	
        settleTopAmt,       //最高结算金额(最大长度:20)单位分；当日累计；提示预警必须手工	
        settleOffAmt,       //最少结算金额(最大长度:20)单位分；最低小金额
        settleAcctName1,    //账户户名(最大长度:120)对公	
        settleAcctNo1,      //结算账号(最大长度:60)对公

        settleAcctName2,    //账户户名(最大长度:120)对私	
        settleAcctNo2,      //结算卡号(最大长度:60)对私
      } = fieldsValue

      const values = {
        id: detailData ? detailData.id : '',
        partnerMapId: detailData ? detailData.partnerMapId : '',
        coinId,	            //结算货币id(最大长度:11)	
        coinName,           //货币名称(最大长度:16)人民币	
        coinCode: 'RMB',	
        coinSymbol: '￥',
        coinUnit,           //货币单位(最大长度:16)元USD	
        coinPoint: 2,
        settleFlag,         //资金归集(最大长度:1)0：独立结算2归集到上级，缺省0	
        settleTType: 'T',   //结算周期(最大长度:1)‘T’、‘D’、’M’	
        settleT,            //结算周期(最大长度:11)天数T+nn>0；默认1	
        settleTopAmt: covertMoney(settleTopAmt, false),      //最高结算金额(最大长度:20)单位分；当日累计；提示预警必须手工	
        settleOffAmt: covertMoney(settleOffAmt, false),           //最少结算金额(最大长度:20)单位分；最低小金额	
        settleFee: 0,       //结算划转费用(最大长度:11)保留0：单位分；正常手续费（非免收）	
        settleAcctType: acctType,   //结算账户类型(最大长度:1)0：结算到对公1结算到对私	
        settleAcctName1,    //账户户名(最大长度:120)对公	
        settleAcctNo1,      //结算账号(最大长度:60)对公	
        settleBankBid1,     //联行代码(最大长度:20)对公	
        settleBidName1,     //开户银行(最大长度:250)对公	
        settleBankId1,      //银行代码(最大长度:11)对公	
        settleBankName1,    //银行名称(最大长度:32)对公	

        settleAcctName2,    //账户户名(最大长度:120)对私	
        settleAcctNo2,      //结算卡号(最大长度:60)对私	
        settleBankBid2,     //联行代码(最大长度:20)对私	
        settleBidName2,     //开户银行(最大长度:250)对私	
        settleBankId2,      //银行代码(最大长度:11)对私	
        settleBankName2,    //银行名称(最大长度:32)对私
      };

      dispatch({
        type: `${namespace}/update`,
        payload: {
          changeOrder: detailData.changeOrder,
          pbanktmp: values
        },
        callback: (res) => {
          if (res) {
            if (res.code == '00') {
              responseMsg(res)
              onReturnList()
            }else{
              responseMsg(res)
            }
          }
        }
      });
    });
  };

  render() {
    const {
      acctType,
      settleBidName1,    //开户银行(最大长度:250)对公
      settleBidName2,   //开户银行(最大长度:250)对私
    } = this.state;

    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    const isDisplay_1 = acctType == 0
    const isDisplay_2 = acctType == 1
    
    return (
      <div className={styles.editFormItem}>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem label='渠道名称' className='singleFormItem'>
              {detailData.partnerName}
            </FormItem>
          </Col>
        </Row>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='结算周期'>
                {getFieldDecorator('settleT', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.settleT : 0}))
                (
                  <StatusSelect options={settleTSelect} placeholder='请选择结算周期'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='资金归集'>
                {getFieldDecorator('settleFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.settleFlag : '0'}))
                (
                  <StatusSelect options={settleFlagSelect} placeholder='请选择资金归集'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='结算币种'>
                {getFieldDecorator('coinId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinId : 156}))
                (
                  <CoinSelect placeholder='请选择结算币种' />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='结算划拨最低金额'>
                {getFieldDecorator('settleTopAmt', Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.settleTopAmt) : 0}))
                (
                  <Input placeholder='请输入结算划拨最低金额' maxLength={8}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='结算划拨最低金额（每笔）'>
                {getFieldDecorator('settleOffAmt', Object.assign({}, decoratorConfig,{initialValue: detailData ? covertMoney2Yuan(detailData.settleOffAmt) : 0}))
                (
                  <Input placeholder='请输入结算划拨最低金额（每笔）' maxLength={8}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='账户类型'>
                {getFieldDecorator('settleAcctType', Object.assign({}, decoratorConfig, {initialValue: acctType}))
                (
                  <RadioGroup onChange={(e) => this.onChangeAcctType(e.target.value)}>
                    <Radio value={'0'}>对公收款账户</Radio>
                    <Radio value={'1'}>对私法人账号</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{display: isDisplay_1 ? 'block' : 'none'}}>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='账户名称'>
                  {getFieldDecorator('settleAcctName1', Object.assign({}, isDisplay_1 ? decoratorConfig : '', {initialValue:  detailData ? detailData.settleAcctName1 : '-'}))
                  (
                    <Input placeholder='请输入账户名称' maxLength={30}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='账号'>
                  {getFieldDecorator('settleAcctNo1', Object.assign({}, isDisplay_1 ? decoratorConfig : '', {initialValue: detailData ? detailData.settleAcctNo1 : 0}))
                  (
                    <Input placeholder='请输入账号' maxLength={30}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='开户银行'>
                  {getFieldDecorator('settleBidName1', Object.assign({}, isDisplay_1 ? decoratorConfig : '', {initialValue: settleBidName1}))
                  (
                    <BankSearch
                      placeholder="请输入开户银行"
                      getmore={(data) => this.getBankData(data, 0)}
                      bidName={settleBidName1}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
          <div style={{display: isDisplay_2 ? 'block' : 'none'}}>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='户名'>
                  {getFieldDecorator('settleAcctName2', Object.assign({},  isDisplay_2 ? decoratorConfig : '',{initialValue: detailData ? detailData.settleAcctName2 : '-'}))
                  (
                    <Input placeholder='请输入账户名称' maxLength={30}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='卡号'>
                  {getFieldDecorator('settleAcctNo2', Object.assign({},  isDisplay_2 ? decoratorConfig : '',{initialValue: detailData ? detailData.settleAcctNo2 : 0}))
                  (
                    <Input placeholder='请输入账号' maxLength={30}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <FormItem label='开户银行'>
                  {getFieldDecorator('settleBidName2', Object.assign({},  isDisplay_2 ? decoratorConfig : '',{initialValue: settleBidName2}))
                  (
                    <BankSearch
                      placeholder="请输入开户银行"
                      getmore={(data) => this.getBankData(data, 1)}
                      bidName={settleBidName2}
                    />
                  )}
                </FormItem>
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
            <Button type="primary" onClick={this.handleSubmit}>变 更</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditBankPage);
export default EditFormPage