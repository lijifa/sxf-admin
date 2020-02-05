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
    //this.getPayType()
  }

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
     
      if (err) return;
      const { 
        paytypeMapId,                 //支付类型(最大长度:11)	
        cardCd,
        mdrPerFee,                    //成本扣率(最大长度:11)百万分比：0表示不进行收单分润	
        mdrFixFee,                    //成本封顶(最大长度:11)单位分； 0表示不封顶	
        issPerFee,                    //发卡方扣率(最大长度:11)百万分比（对商户）	
        issFixFee,                    //发卡方封顶(最大长度:11)单位分； 0表示不封顶（对商户）	
        netPerFee,                    //网络方扣率(最大长度:11)百万分比（对商户）	
        netFixFee,                    //网络方封顶(最大长度:11)单位分； 0表示不封顶（对商户）	
        brandPerFee,                  //品牌方扣率(最大长度:11)百万分比（对商户）	
        brandFixFee,                  //品牌方封顶(最大长度:11)单位分； 0表示不封顶（对商户）
       } = fieldsValue
      const { instMapId, hostMapId } = this.state
      let values = {
        id: detailData.id,
        instMapId,
        hostMapId,
        paytypeMapId,
        cardCd,
        mdrPerFee,
        mdrFixFee: covertMoney(mdrFixFee, false),
        issPerFee,
        issFixFee: covertMoney(issFixFee, false),
        netPerFee,
        netFixFee: covertMoney(netFixFee, false),
        brandPerFee,
        brandFixFee: covertMoney(brandFixFee, false),
      }
      dispatch({
        type: `${namespace}/update`,
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
    const {detailData} = this.props
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
 
    let num = 0
    return <Timeline.Item key={num}>
          <p>{detailData.paytypeName}</p>
          <Row gutter={16} style={{display: detailData.mdrType == 1 ? 'none' : 'block'}}>
            <Col span={8}>
              <FormItem label='成本扣率'>
                {getFieldDecorator(`mdrPerFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.mdrPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入成本扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`mdrFixFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.mdrFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{display: detailData.mdrType == 0 ? 'none' : 'block'}}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='发卡方扣率'>
                {getFieldDecorator(`issPerFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.issPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入发卡方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`issFixFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.issFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='网络方扣率'>
                {getFieldDecorator(`netPerFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.netPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入网络方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`netFixFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.netFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='品牌方扣率'>
                {getFieldDecorator(`brandPerFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.brandPerFee : 0}))
                (
                  <Input addonAfter="%" placeholder='请输入品牌方扣率' maxLength={2}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={'封顶'}>
                {getFieldDecorator(`brandFixFee`, Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.brandFixFee) : 0.00}))
                (
                  <Input placeholder='请输入手续费'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem >
            {getFieldDecorator(`paytypeMapId`, Object.assign({}, {}, {initialValue: detailData ? detailData.paytypeMapId : detailData.paytypeMapId}))
            (
              <Input type='hidden' placeholder='支付方式'/>
            )}
          </FormItem>
  
          <FormItem >
            {getFieldDecorator(`cardCd`, Object.assign({}, {}, {initialValue: detailData ? detailData.cardCd : 9}))
            (
              <Input type='hidden' placeholder='借贷标记'/>
            )}
          </FormItem>
          </div>
        </Timeline.Item>
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