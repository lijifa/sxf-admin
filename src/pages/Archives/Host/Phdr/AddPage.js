import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Divider, Timeline  } from 'antd';
import {responseMsg, getObjStatus, covertMoney2Yuan, covertMoney} from '@/utils/utils';
import TKInstitudeSelect from '@/components/TKInstitudeSelect';
import TKHostSelect from '@/components/TKHostSelect';
import styles from './styles.less';
const cardCdSelect = [
  {key: 0, value: '借记卡'},
  {key: 1, value: '贷记卡'}
]

const FormItem = Form.Item;
const namespace = 'phdr';
@connect(({ phdr, paytype, insthost, loading }) => ({
  result: phdr.selectData,
  resultPaytype: paytype.selectData,
  resultHostDetail: insthost.detailRes,
  loading: loading.effects['phdr/queryAll'] ? true : false,
}))

class EditPage extends Component {
  
  state = {
    instMapId: this.props.detailData ? this.props.detailData.instMapId : '',
    hostMapId: this.props.detailData ? this.props.detailData.hostMapId : '',
    instHostCode: this.props.detailData ? this.props.detailData.instHostCode : '',
    coinName: this.props.detailData ? this.props.detailData.coinName : '',
    payTypeList: []

  };

  componentDidMount() {
    this.getPayType()
  }
  
  //获取支付方式
  // getPayTypeList = () => {
  //   const { dispatch, detailData } = this.props;
  //   if (detailData) {
  //     let response = [];
  //     response.push(detailData);
  //     this.setState({
  //       payTypeList: response
  //     })
  //   } else {
  //     dispatch({
  //         type: `paytype/queryAll`,
  //         payload: {
  //           mdrType: 9
  //         }
  //     }).then(()=>{
  //         let response = this.props.resultPaytype;
  //         this.setState({
  //           payTypeList: response.data
  //         })
  //     });
  //   }
  // }

  getPayType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `paytype/queryAll`,
      payload: {
        mdrType: 9
      }
    });
  }

  //获取通道详情
  getHostDetail = (hostMapId) => {
    const { dispatch } = this.props;
    dispatch({
        type: `insthost/detail`,
        payload: {
          hostMapId: hostMapId
        }
    }).then(()=>{
      let response = this.props.resultHostDetail;
      this.setState({
        instHostCode: response.data.instHostCode,
        coinName: response.data.coinName
      })
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
    //   submitData = fieldsValue.pdrList.map((item) => {
    //     return {
    //       id: item.id,
    //       partnerMapId: item.partnerMapId,
    //       paytypeMapId: item.paytypeMapId,
    //       cardCd: item.cardCd,
    //       mdrType: 0,
    //       transAmt1: 0,
    //       mdrPerFee1: item.mdrPerFee1,
    //       mdrFixFee1: covertMoney(item.mdrFixFee1, false) ,
    //       transAmt2: 0,
    //       mdrPerFee2: 0,
    //       mdrFixFee2: 0,
    //       transAmt3: 0,
    //       mdrPerFee3: 0,
    //       mdrFixFee3: 0
    //     }
    //   })



      if (err) return;
      const { pdrList } = fieldsValue
      const { instMapId, hostMapId, payTypeList } = this.state
      let pyList = pdrList.map((item) => {
        return {
          id: detailData.id,
          instMapId,
          hostMapId,
          paytypeMapId: item.paytypeMapId,
          cardCd: item.cardCd,
          mdrPerFee: item.mdrPerFee,
          mdrFixFee: covertMoney(item.mdrFixFee, false),
          issPerFee: item.issPerFee,
          issFixFee: covertMoney(item.issFixFee, false),
          netPerFee: item.netPerFee,
          netFixFee: covertMoney(item.netFixFee, false),
          brandPerFee: item.brandPerFee,
          brandFixFee: covertMoney(item.brandFixFee, false),
        }
      })
      const values = detailData ? pyList[0] : { batchParam: pyList }    
      
      dispatch({
        type: detailData ? `${namespace}/update` : `${namespace}/batchAdd`,
        payload: values,
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

  updatePayType = (paytypeId, name, val) => {
    let oldList = this.state.payTypeList;    
    oldList.map((item, key)=>{
      if(item.paytypeId == paytypeId){
        oldList[key][name] = val
      }
    });
    this.setState({ payTypeList: oldList })
  }
  
  mdrTypeRender = () => {
    const {resultPaytype, loading, detailData} = this.props
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    let options = ''

    if (!detailData || detailData.length < 1) {
      options = resultPaytype ? resultPaytype.data : []
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
            <Row gutter={16} style={{display: item.mdrType == 1 ? 'none' : 'block'}}>
              <Col span={8}>
                <FormItem label='成本扣率'>
                  {getFieldDecorator(`pdrList[${num}]['mdrPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrPerFee : 0}))
                  (
                    <Input addonAfter="%" placeholder='请输入成本扣率' maxLength={2}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'封顶'}>
                  {getFieldDecorator(`pdrList[${num}]['mdrFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.mdrFixFee) : 0.00}))
                  (
                    <Input placeholder='请输入手续费'/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <div style={{display: item.mdrType == 0 ? 'none' : 'block'}}>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem label='发卡方扣率'>
                  {getFieldDecorator(`pdrList[${num}]['issPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.issPerFee : 0}))
                  (
                    <Input addonAfter="%" placeholder='请输入发卡方扣率' maxLength={2}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'封顶'}>
                  {getFieldDecorator(`pdrList[${num}]['issFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.issFixFee) : 0.00}))
                  (
                    <Input placeholder='请输入手续费'/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <FormItem label='网络方扣率'>
                  {getFieldDecorator(`pdrList[${num}]['netPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.netPerFee : 0}))
                  (
                    <Input addonAfter="%" placeholder='请输入网络方扣率' maxLength={2}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'封顶'}>
                  {getFieldDecorator(`pdrList[${num}]['netFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.netFixFee) : 0.00}))
                  (
                    <Input placeholder='请输入手续费'/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <FormItem label='品牌方扣率'>
                  {getFieldDecorator(`pdrList[${num}]['brandPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.brandPerFee : 0}))
                  (
                    <Input addonAfter="%" placeholder='请输入品牌方扣率' maxLength={2}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label={'封顶'}>
                  {getFieldDecorator(`pdrList[${num}]['brandFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.brandFixFee) : 0.00}))
                  (
                    <Input placeholder='请输入手续费'/>
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
              {getFieldDecorator(`pdrList[${num}]['cardCd\']`, Object.assign({}, {}, {initialValue: detailData ? item.cardCd : i}))
              (
                <Input type='hidden' placeholder='借贷标记'/>
              )}
            </FormItem>
            </div>
          </Timeline.Item>)
          num++
        }
      }else{
        payTypeRender.push(<Timeline.Item key={num}>
          <p>{item.paytypeName} {item.cardCd && item.cardCd != 9 ? '【'+getObjStatus(cardCdSelect, item.cardCd)+'】' : ''}</p>
          <Row gutter={16} style={{display: item.mdrType == 1 ? 'none' : 'block'}}>
            <Col span={8}>
              <FormItem label='成本扣率'>
                {getFieldDecorator(`pdrList[${num}]['mdrPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入成本扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`pdrList[${num}]['mdrFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.mdrFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{display: item.mdrType == 0 ? 'none' : 'block'}}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='发卡方扣率'>
                {getFieldDecorator(`pdrList[${num}]['issPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.issPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入发卡方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`pdrList[${num}]['issFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.issFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='网络方扣率'>
                {getFieldDecorator(`pdrList[${num}]['netPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.netPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入网络方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`pdrList[${num}]['netFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.netFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='品牌方扣率'>
                {getFieldDecorator(`pdrList[${num}]['brandPerFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.brandPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入品牌方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`pdrList[${num}]['brandFixFee']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(item.brandFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
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
            {getFieldDecorator(`pdrList[${num}]['cardCd\']`, Object.assign({}, {}, {initialValue: detailData ? item.cardCd : 9}))
            (
              <Input type='hidden' placeholder='借贷标记'/>
            )}
          </FormItem>
          </div>
        </Timeline.Item>)
        num++
      } 
    }
    return payTypeRender
  }

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
        fontWeight: 'bold'
    }
    
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              {
                detailData ?
                  <div>
                    <p style={detailTitle}>归属机构</p>
                    <p style={detailText}>{detailData.instName}</p>
                  </div>
                :
                  <FormItem label='归属机构'>
                    {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : []}))
                      (<TKInstitudeSelect
                        placeholder='请选择归属机构'
                        onChange={(val)=>{ this.setState({ instMapId: val }) }}
                      />
                    )}
                  </FormItem>
              }
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              {
                detailData ?
                  <div>
                    <p style={detailTitle}>归属通道</p>
                    <p style={detailText}>{detailData.hostName}</p>
                  </div>
                :
                <FormItem label='归属通道'>
                  {getFieldDecorator('hostMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMapId : ''}))
                    (<TKHostSelect
                      placeholder='请选择归属通道'
                      onChange={(val)=>{  
                        this.setState({ hostMapId: val })
                        this.getHostDetail( val )
                      }}
                    />
                  )}
                </FormItem>
              }              
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>通道分配机构号</p>
                <p style={detailText}>{ this.state.instHostCode }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>结算币种</p>
                <p style={detailText}>{ this.state.coinName }</p>
              </div>
            </Col>
          </Row>
          
          <Divider />

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
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage