import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input } from 'antd';
import {responseMsg, getOrgData, getOrgStr} from '@/utils/utils';
import CitySelect from '@/components/TKCitySelect';
import UploadImg from '@/components/MSupload';
import OrgSelect from '@/components/TKOrgSelect';
import StatusSelect from '@/components/MsStatusSelect';
import MerSelect from '@/components/TKMerSelect';
import MccSelect from '@/components/TKMccSelect';
import styles from './styles.less';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const FormItem = Form.Item;

const merLvSelect = [
  {key: 1, value: '普通商户'},
  {key: 2, value: '商户总部'},
  {key: 3, value: '商户分部'}
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
    customLogo: imgDemo,
    mccId: this.props.detailData ? this.props.detailData.mccId : 0,
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0
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
        customLogo: detailData ? detailData.customLogo : imgDemo,
        mccId: detailData ? detailData.mccId : 0,
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
      customLogo,
      mccId
    } = this.state;
    const { dispatch, form, detailData, clickNext } = this.props;

    const { instMapId, partnerMapId, partnerMapIdP } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        merName,
        merNameEn,
        merMapIdP,
        merLevel,
        // contractNo,
        // contractExp,
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
        merMapId: detailData ? detailData.merMapId : '',
        instMapId,
        partnerMapId,
        partnerMapIdP,              //渠道父ID
        merName,                    //商户名称
        merNameEn,                  //商户英文名称
        merMapIdP,                  //商户父Id
        merLevel,                   //商户级别
        flagStatus: 2,
        paytypeOpen: 0,             //支付开通
        contractNo: '11',                 //合同编号
        contractExp: '3333',                //合同有效期
        customLogo,                 //定制系统Logo
        customTitle,                //定制系统标题 
        openTimeLocal: '080000',    //营业时间	
        closeTimeLocal: '235959',   //打烊时间	
        mccId,	                    //行业类型
        commRegionId,               //国家地区
        commCityId,                 //区县代码
        commCityCountyName,         //区县名称
        commCityName,               //城市名称
        commCityProvName,           //省份名称
        commCityZip,                //邮编
        commAddress,                //地址
        commMan,                    //联系人
        commMobile,                 //联系人手机
        commTel,                    //联系电话
        commFax,                    //传真
        commEmail                   //邮箱
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
        cityStr = partner.commCityProvName + ' - ' + partner.commCityName
      }
      if (partner.commCityCountyName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityName + ' - ' + partner.commCityCountyName
      }
    }

    if (flag == 'array') {
      if (partner.commCityProvName) {
        cityStr = [partner.commCityProvName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityName]
      }
      if (partner.commCityCountyName) {
        cityStr = [partner.commCityProvName, partner.commCityName, partner.commCityCountyName]
      }
    }
    return cityStr
  }

  changeMcc = (e) => {
    this.setState({
      mccId: e
    })
  }

  //获取组织数据
  onChangeOrg = (data) => {
    let odata = ''
    odata = getOrgData(data, 0)
    this.setState({
      instMapId: odata.instMapId,
      partnerMapId: odata.partnerMapId,
      partnerMapIdP: odata.partnerMapIdP
    })
  }

  render() {
    const { commCityZip, customLogo, mccId } = this.state;
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
              <FormItem label='归属'>
                {getFieldDecorator('orgData', Object.assign({}, decoratorConfig, {initialValue: detailData ? getOrgStr(detailData, 'array') : []}))
                (
                  <OrgSelect
                    allData={true}
                    placeholder='请选择归属机构'
                    onChange={(val) => this.onChangeOrg(val)}
                    editValue={detailData ? getOrgStr(detailData, 'array') : ''}
                  />
                )}
              </FormItem>
              <FormItem label='行业类别'>
                {getFieldDecorator('mccId', Object.assign({}, decoratorConfig, {initialValue: mccId ? [detailData.mccName] : 0}))
                (
                  <MccSelect
                    placeholder='请选择行业类别'
                    onChange={(e)=>this.changeMcc(e)}
                    editValue={mccId ? [detailData.mccName] : ''}
                  />
                )}
              </FormItem>
              <FormItem label='商户级别'>
                {getFieldDecorator('merLevel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merLevel : 1}))
                (
                  <StatusSelect options={merLvSelect} placeholder='请选择商户级别'/>
                )}
              </FormItem>
              
              <FormItem label='上级商户'>
                {getFieldDecorator('merMapIdP', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merMapIdP : 0}))
                (
                  <MerSelect placeholder='请选择上级商户'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <UploadImg imgPath={customLogo} onChange={(e)=>this.valueChanged('customLogo', e)}/>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='商户名称'>
                {getFieldDecorator('merName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merName : ''}))
                (
                  <Input placeholder='请输入商户名称' maxLength={60}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='英文名称'>
                {getFieldDecorator('merNameEn', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merNameEn : ''}))
                (
                  <Input placeholder='请输入英文名称' maxLength={60}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
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
                  <Input placeholder='请输入Email' maxLength={14}/>
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