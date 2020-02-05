import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Divider } from 'antd';
import {responseMsg, changeTime, covertMoney2Yuan, covertMoney} from '@/utils/utils';
import styles from './styles.less';
import PayTypeMoreSelect from '@/components/TKPaytypeSelect/MoreSelect';
import TransTypeMoreSelect from '@/components/TKTranstypeSelect/MoreSelect';
const certPhoto = 'http://m.xingdata.com:8080/tkcimg/img_1.png';
const lpPhoto1 = 'http://m.xingdata.com:8080/tkcimg/img_2.png';
const lpPhoto2 = 'http://m.xingdata.com:8080/tkcimg/img_3.png';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const FormItem = Form.Item;
const namespace = 'bank';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditCertPage extends Component {

  constructor (props) {
    super(props)
  }

  state = {
    img1: certPhoto,
    img2: lpPhoto1,
    img3: lpPhoto2,
    img4: imgDemo,
    img5: imgDemo,
    img6: imgDemo,
    img7: imgDemo,
    img8: imgDemo,
  }

  valueChanged(key, value) {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(0, '', 'back')
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, clickNext } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        merGrade,	    //风险级别	
        maxDayAmt,	  //日均限额	
        maxPerAmt,	  //单笔限额	
        curDayAmt,	  //本日额度	
        openPaytrans,	//交易开通	
        openPaytype,	//支付开通	
        merRiskbound,	//风险积数	
        dataReserve 	//风险说明
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        //partnerMapId: detailData ? detailData.partnerMapId : '',
        merGrade,	    //风险级别
        maxDayAmt: covertMoney(maxDayAmt, false),	  //日均限额	
        maxPerAmt: covertMoney(maxPerAmt, false),	  //单笔限额	
        curDayAmt,	  //本日额度	
        openPaytrans: openPaytrans && openPaytrans.length > 0 ? openPaytrans.join(',') : '',	//交易开通	
        openPaytype: openPaytype && openPaytype.length > 0 ? openPaytype.join(',') : '',	//支付开通	
        merRiskbound,	//风险积数	
        dataReserve 	//风险说明
      };

      clickNext(1, values)

      // if (detailData) {
      //   dispatch({
      //     type: `${namespace}/update`,
      //     payload: values,
      //     callback: (res) => {
      //       if (res) {
      //         if (res.code == '00') {
      //           responseMsg(res)
                
      //         }else{
      //           responseMsg(res)
      //         }
      //       }
      //     }
      //   });
      // }else{
      //   clickNext(1, values)
      // }
    });
  };

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    const certStyle = {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px'
    }
    const certTitleStyle = {
      marginBottom: '4px'
    }

    let paytrans = [], paytranstmp = [], paytypetmp = [], paytype = []
    if (detailData) {
      paytrans = detailData.openPaytrans.split(',')
      paytype = detailData.openPaytype.split(',')
      // paytrans = paytranstmp.map((item) => {
      //   paytrans.push(item.toString())
      // })
      // paytype = paytypetmp.map((item) => {
      //   paytype.push(item.toString())
      // })
    }
   

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='日均限额'>
                {getFieldDecorator('maxDayAmt', Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.maxDayAmt) : 0}))
                (
                  <Input placeholder='请输入日均限额' maxLength={8}/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='单笔限额'>
                {getFieldDecorator('maxPerAmt', Object.assign({}, decoratorConfig, {initialValue: detailData ? covertMoney2Yuan(detailData.maxPerAmt) : 0}))
                (
                  <Input placeholder='请输入单笔限额' maxLength={8}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='交易开通'>
                {getFieldDecorator('openPaytrans', Object.assign({}, decoratorConfig, {initialValue: paytrans}))
                (
                  <TransTypeMoreSelect placeholder='请输入交易开通'/>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label='支付开通'>
                {getFieldDecorator('openPaytype', Object.assign({}, decoratorConfig,{initialValue: paytype}))
                (
                  <PayTypeMoreSelect placeholder='请输入支付开通'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>风险评级</p>
              <div style={certStyle}>
                普通商户
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>风险积数</p>
              <div style={certStyle}>
                0
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>手输比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>退货比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>调单比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>非营业时间比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>失败比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>退单比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
          </Row>
          
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

const EditFormPage = Form.create()(EditCertPage);
export default EditFormPage