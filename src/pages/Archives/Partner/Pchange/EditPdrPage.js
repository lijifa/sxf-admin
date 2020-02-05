import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Checkbox, Timeline } from 'antd';
import {responseMsg, covertMoney, getObjStatus, covertMoney2Yuan} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const cardCdSelect = [
  {key: 0, value: '借记卡'},
  {key: 1, value: '贷记卡'}
]
const namespace = 'partnerchange';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPdrPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.getPayType()
  }

  getPayType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  state = {
    nextFlag: 0,
    wxDown: 1,
    wxOnline: 1
  }
  
  valueChanged(key, value) {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(2, '', 'back')
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let submitData = ''
      submitData = fieldsValue.pdrList.map((item) => {
        return {
          id: item.id,
          partnerMapId: item.partnerMapId,
          paytypeMapId: item.paytypeMapId,
          cardCd: item.cardCd,
          mdrType: 0,
          transAmt1: 0,
          mdrPerFee1: item.mdrPerFee1,
          mdrFixFee1: covertMoney(item.mdrFixFee1, false) ,
          transAmt2: 0,
          mdrPerFee2: 0,
          mdrFixFee2: 0,
          transAmt3: 0,
          mdrPerFee3: 0,
          mdrFixFee3: 0
        }
      })
      //clickNext(3, submitData, 'submit')

      dispatch({
        type: `${namespace}/update`,
        payload: {
          changeOrder: detailData.changeOrder,
          pdrtmpsList: submitData
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

  onChange = e => {
    this.setState({
      wxDown: e.target.value,
    });
  };

  mdrFixFeeRender = (key, label) => {
    return label
    // return(
    //   <Checkbox onChange={(e)=>this.valueChanged(key, e.target.value)}>{label}</Checkbox>
    // )
  }

  mdrTypeRender = () => {
    const {result, loading, detailData} = this.props
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    let options = ''
    if (!detailData || detailData.length < 1) {
      options = result ? result.data : []
    }else{
      options = detailData
    }
    let payTypeRender = []
    let num = 0
    for (let index = 0; index < options.length; index++) {
      let item = options[index]
      let isAdd = detailData && detailData.length > 1 ? false : (item.paytypeId == 1000 || item.paytypeId == 2000)
    
      if (isAdd) {
        for (let i = 0; i < 2; i++) {
          payTypeRender.push(<Timeline.Item key={num}>
            <p>{item.paytypeName} 【{getObjStatus(cardCdSelect, i)}】</p>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem label='手续费扣率'>
                  {getFieldDecorator(`pdrList[${num}]['mdrPerFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrPerFee1 : 0}))
                  (
                    <Input addonAfter="%" placeholder='请输入扣率' maxLength={4}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={this.mdrFixFeeRender(`pdrList[${num}]['mdrFixFee1Flag']`,'手续费封顶')}>
                  {getFieldDecorator(`pdrList[${num}]['mdrFixFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.mdrFixFee1) : 0.00}))
                  (
                    <Input placeholder='请输入手续费' maxLength={8}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem >
              {getFieldDecorator(`pdrList[${num}]['paytypeMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.paytypeMapId : item.paytypeId}))
              (
                <Input type='hidden' placeholder='支付方式'/>
              )}
            </FormItem>
    
            <FormItem >
              {getFieldDecorator(`pdrList[${num}]['merMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.merMapId : ''}))
              (
                <Input type='hidden' placeholder='商户ID'/>
              )}
            </FormItem>
    
            <FormItem >
              {getFieldDecorator(`pdrList[${num}]['id\']`, Object.assign({}, {}, {initialValue: detailData ? item.id : ''}))
              (
                <Input type='hidden' placeholder='支付方式'/>
              )}
            </FormItem>
    
            <FormItem >
              {getFieldDecorator(`pdrList[${num}]['changeOrder\']`, Object.assign({}, {}, {initialValue: detailData ? item.changeOrder : ''}))
              (
                <Input type='hidden' placeholder='修改订单编号'/>
              )}
            </FormItem>
            <FormItem >
              {getFieldDecorator(`pdrList[${num}]['cardCd\']`, Object.assign({}, {}, {initialValue: detailData ? item.cardCd : i}))
              (
                <Input type='hidden' placeholder='修改订单编号'/>
              )}
            </FormItem>
          </Timeline.Item>)
          num++
        }
      }else{
        payTypeRender.push(<Timeline.Item key={num}>
          <p>{item.paytypeName} {item.cardCd && item.cardCd != 9 ? '【'+getObjStatus(cardCdSelect, item.cardCd)+'】' : ''}</p>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='手续费扣率'>
                {getFieldDecorator(`pdrList[${num}]['mdrPerFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrPerFee1 : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入扣率' maxLength={4}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={this.mdrFixFeeRender(`pdrList[${num}]['mdrFixFee1Flag']`,'手续费封顶')}>
                {getFieldDecorator(`pdrList[${num}]['mdrFixFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.mdrFixFee1) : 0.00}))
                (
                  <Input placeholder='请输入手续费' maxLength={8}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            {getFieldDecorator(`pdrList[${num}]['paytypeMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.paytypeMapId : item.paytypeId}))
            (
              <Input type='hidden' placeholder='支付方式'/>
            )}
          </FormItem>
  
          <FormItem >
            {getFieldDecorator(`pdrList[${num}]['merMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.merMapId : ''}))
            (
              <Input type='hidden' placeholder='商户ID'/>
            )}
          </FormItem>
  
          <FormItem >
            {getFieldDecorator(`pdrList[${num}]['id\']`, Object.assign({}, {}, {initialValue: detailData ? item.id : ''}))
            (
              <Input type='hidden' placeholder='支付方式'/>
            )}
          </FormItem>
  
          <FormItem >
            {getFieldDecorator(`pdrList[${num}]['changeOrder\']`, Object.assign({}, {}, {initialValue: detailData ? item.changeOrder : ''}))
            (
              <Input type='hidden' placeholder='修改订单编号'/>
            )}
          </FormItem>
          <FormItem >
            {getFieldDecorator(`pdrList[${num}]['cardCd\']`, Object.assign({}, {}, {initialValue: detailData ? item.cardCd : 9}))
            (
              <Input type='hidden' placeholder='修改订单编号'/>
            )}
          </FormItem>
        </Timeline.Item>)
        num++
      } 
    }
    return payTypeRender
  }

  render() {
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical'>
          <Timeline>
            {this.mdrTypeRender()}
          </Timeline>

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
            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPdrPage);
export default EditFormPage