import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import CitySelect from '@/components/TKCitySelect';
import UploadImg from '@/components/MSupload';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import StatusSelect from '@/components/MsStatusSelect';
import PartnerSelect from '@/components/TKPartnerSelect';
import styles from './styles.less';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const FormItem = Form.Item;
const partnerLvSelect = [
  {key: 1, value: '一级渠道'},
  {key: 2, value: '二级渠道'}
]
const namespace = 'bank';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditInfoPage extends Component {
  
  constructor (props) {
    super(props)
  }

  state = {
    commRegionId: '156',
    commCityId: '',
    commCityCountyName: '',
    commCityName: '',
    commCityProvName: '',
    commCityZip: '',
    customLogo: imgDemo
  }

  componentWillReceiveProps(nextProps) {
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 0 ) {
      this.setState({
        commRegionId: detailData ? detailData.commRegionId : '156',
        commCityId: detailData ? detailData.commCityId : '',
        commCityCountyName: detailData ? detailData.commCityCountyName : '',
        commCityName: detailData ? detailData.commCityName : '',
        commCityProvName: detailData ? detailData.commCityProvName : '',
        commCityZip: detailData ? detailData.commCityZip : '',
        customLogo: detailData ? detailData.customLogo : imgDemo
      })
    }
  }
  
  getCityData = (e) => {
    let lastData = e[e.length-1]
    this.setState({
      commRegionId: lastData.regionId,
      commCityId: lastData.id,
      commCityCountyName: e[1] ? e[1].name : '',
      commCityName: e[2] ? e[2].name : '',
      commCityProvName: e[0].name,
      commCityZip: lastData.cityZip,
    })
  }

  valueChanged = (key, value) => {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  handleSubmit = e => {
    e.preventDefault();

    const { 
      commRegionId,
      commCityId,
      commCityCountyName,
      commCityName,
      commCityProvName,
      commCityZip,
      customLogo
    } = this.state;
    const { dispatch, form, detailData, clickNext } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        instMapId,
        partnerMapIdP,
        partnerName,
        partnerLevel,
        contractNo,
        contractExp,
        customTitle,
        commAddress,
        commMan,
        commMobile,
        commTel,
        commFax,
        commEmail,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        partnerMapId: detailData ? detailData.partnerMapId : '',
        instMapId,
        partnerMapIdP,        //渠道父ID
        partnerName,          //渠道名称
        partnerLevel,         //渠道级别
        paytypeOpen: 0,       //支付开通
        contractNo,           //合同编号
        contractExp,          //合同有效期
        customLogo,           //定制系统Logo
        customTitle,          //定制系统标题
        commRegionId,         //国家地区
        commCityId,           //区县代码
        commCityCountyName,   //区县名称
        commCityName,         //城市名称
        commCityProvName,     //省份名称
        commCityZip,          //邮编
        commAddress,          //地址
        commMan,              //联系人
        commMobile,           //联系人手机
        commTel,              //联系电话
        commFax,              //传真
        commEmail             //邮箱
      };

      clickNext(0, values)

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
      //   clickNext(0, values)
      // }
    });
  };

  getCityStr = (partner, flag='str') => {
    let cityStr = '-'
    //判断以何种方式返回城市信息【字符串，数组】
    if (flag == 'str') {
      if (partner.commCityProvName) {
        cityStr = partner.commCityProvName
      }
      if (partner.commCityName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityCountyName
      }
      if (partner.commCityName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityCountyName + ' - ' + partner.commCityName
      }
    }

    if (flag == 'array') {
      if (partner.commCityProvName) {
        cityStr = [partner.commCityProvName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityCountyName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityCountyName, partner.commCityName]
      }
    }
    return cityStr
  }

  render() {
    const { commCityZip, customLogo } = this.state;
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='归属机构'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (
                  <InstitudeSelect placeholder='请输入归属机构' />
                )}
              </FormItem>

              <FormItem label='级别'>
                {getFieldDecorator('partnerLevel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.partnerLevel : 1}))
                (
                  <StatusSelect options={partnerLvSelect} placeholder='请选择级别'/>
                )}
              </FormItem>
              
              <FormItem label='上级渠道'>
                {getFieldDecorator('partnerMapIdP', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.partnerMapIdP : 0}))
                (
                  <PartnerSelect placeholder='请选择上级渠道'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <UploadImg imgPath={customLogo} onChange={(e)=>this.valueChanged('customLogo', e)}/>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='渠道名称'>
                {getFieldDecorator('partnerName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.partnerName : ''}))
                (
                  <Input placeholder='请输入渠道名称' maxLength={30}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='联系人'>
                {getFieldDecorator('commMan', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commMan : ''}))
                (
                  <Input placeholder='请输入联系人' maxLength={30}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='注册地址'>
                {getFieldDecorator('commCityId', Object.assign({}, decoratorConfig, {initialValue: detailData ? this.getCityStr(detailData, 'array') : []}))
                (
                  <CitySelect allData={true} placeholder='请选择城市名称' onChange={(e) => this.getCityData(e)} editValue={detailData ? this.getCityStr(detailData, 'array') : ''}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label=''>
                {getFieldDecorator('commAddress', Object.assign({}, decoratorConfig,{initialValue: detailData ? detailData.commAddress : ''}))
                (
                  <Input placeholder='请输入详细地址' maxLength={100}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='邮政编码'>
                {getFieldDecorator('commCityZip', Object.assign({}, {initialValue: detailData ? detailData.commCityZip : commCityZip}))
                (
                  <Input placeholder='请输入邮政编码' maxLength={6}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='Email'>
                {getFieldDecorator('commEmail', Object.assign({}, {initialValue: detailData ? detailData.commEmail : ''}))
                (
                  <Input placeholder='请输入Email' maxLength={30}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <FormItem label='手机号'>
                {getFieldDecorator('commMobile', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commMobile : ''}))
                (
                  <Input placeholder='请输入手机号' maxLength={11}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='电话号码'>
                {getFieldDecorator('commTel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commTel : ''}))
                (
                  <Input placeholder='请输入电话号码' maxLength={14}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='传真号码'>
                {getFieldDecorator('commFax', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commFax : ''}))
                (
                  <Input placeholder='请输入传真号码' maxLength={14}/>
                )}
              </FormItem>
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
            <Button type="primary" onClick={(e)=>this.handleSubmit(e)}>下一步</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditInfoPage);
export default EditFormPage