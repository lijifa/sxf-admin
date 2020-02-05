import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Divider } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import CitySelect from '@/components/TKCitySelect';
import UploadImg from '@/components/MSupload';
import styles from './styles.less';

const certPhoto = 'http://m.xingdata.com:8080/tkcimg/img_1.png';
const lpPhoto1 = 'http://m.xingdata.com:8080/tkcimg/img_2.png';
const lpPhoto2 = 'http://m.xingdata.com:8080/tkcimg/img_3.png';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const FormItem = Form.Item;
const namespace = 'merchantchange';
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
    cityData: [],
    cityAddress: '',
    certAddress: ''
  }

  // componentDidMount() {
  //   const { detailData } = this.props;
  //   this.setState({
  //     img1: detailData ? detailData.certPhoto : certPhoto,
  //     img2: detailData ? detailData.certLpPhoto1 : lpPhoto1,
  //     img3: detailData ? detailData.certLpPhoto2 : lpPhoto2,
  //     img4: detailData ? detailData.certAddrPhoto1 : imgDemo,
  //     img5: detailData ? detailData.certAddrPhoto2 : imgDemo,
  //     img6: detailData ? detailData.certAddrPhoto3 : imgDemo,
  //     img7: detailData ? detailData.certAddrPhoto4 : imgDemo,
  //     img8: detailData ? detailData.certAddrPhoto5 : imgDemo,
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 1 ) {
      let cityD = [], certAddr = detailData.certAddress
      if (detailData.certAddress && detailData.certAddress.indexOf(' / ') != -1) {
        cityD = detailData.certAddress.split(' / ')[0]
        certAddr = detailData.certAddress.split(' / ')[1]
      }
      
      this.setState({
        img1: detailData ? detailData.certPhoto : certPhoto,
        img2: detailData ? detailData.certLpPhoto1 : lpPhoto1,
        img3: detailData ? detailData.certLpPhoto2 : lpPhoto2,
        img4: detailData ? detailData.certAddrPhoto1 : imgDemo,
        img5: detailData ? detailData.certAddrPhoto2 : imgDemo,
        img6: detailData ? detailData.certAddrPhoto3 : imgDemo,
        img7: detailData ? detailData.certAddrPhoto4 : imgDemo,
        img8: detailData ? detailData.certAddrPhoto5 : imgDemo,

        cityData: cityD.length > 0 ? cityD.split(' - ') : [],
        cityAddress: cityD.length > 0 ? cityD : '',
        certAddress: detailData ? certAddr : '',
      })
    }
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

  getCityData = (e) => {
    let lastData = e[e.length-1]
    let data = ''
    data = {
      commCityCountyId: lastData.id,
      commCityCountyName: e[1] ? e[1].name : '',
      commCityName: e[2] ? e[2].name : '',
      commCityProvName: e[0].name
    }
    
    this.setState({
      cityAddress: this.getCityStr(data)
    })
  }

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

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList, checkType } = this.props;
    const { img1, img2, img3, img4, img5, img6, img7, img8, cityAddress } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        certName,
        certAddress,
        certTaxNo,
        certLpName,
        certLpId,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        certName,
        certAddress: cityAddress + ' / ' + certAddress,
        certTaxNo,
        certLpName,
        certLpId,
        certPhoto: img1,
        certLpPhoto1: img2,
        certLpPhoto2: img3,
        certAddrPhoto1: img4,
        certAddrPhoto2: img5,
        certAddrPhoto3: img6,
        certAddrPhoto4: img7,
        certAddrPhoto5: img8,
      };

      // clickNext(1, values)
      dispatch({
        type: `${namespace}/update`,
        payload: {
          checkType: checkType,
          mcerttmp: values
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
    const { img1, img2, img3, img4, img5, img6, img7, img8, cityData, certAddress } = this.state;
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    const certStyle = {
      textAlign:'center',
      border: '1px solid #ccc',
      marginBottom: '10px'
    }
    const certTitleStyle = {
      marginBottom: '4px'
    }
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' >
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='商户名称' className='singleFormItem'>
                {detailData.merName}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='纳税人识别号'>
                {getFieldDecorator('certTaxNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certTaxNo : ''}))
                (
                  <Input placeholder='请输入纳税人识别号' maxLength={32}/>
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label='营业执照名称'>
                {getFieldDecorator('certName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certName : ''}))
                (
                  <Input placeholder='请输入营业执照名称' maxLength={30}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='法人姓名'>
                {getFieldDecorator('certLpName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certLpName : ''}))
                (
                  <Input placeholder='请输入法人姓名' maxLength={30}/>
                )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem label='法人身份证号码'>
                {getFieldDecorator('certLpId', Object.assign({}, decoratorConfig,{initialValue: detailData ? detailData.certLpId : ''}))
                (
                  <Input placeholder='请输入法人身份证号码' maxLength={18}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='注册地址'>
                {getFieldDecorator('certCityId', Object.assign({}, {}, {initialValue: detailData ? detailData.certCityId : []}))
                (
                  <CitySelect allData={true} placeholder='请选择城市名称' onChange={(e) => this.getCityData(e)} editValue={cityData.length > 0 ? cityData : ''} />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label=''>
                {getFieldDecorator('certAddress', Object.assign({}, decoratorConfig,{initialValue: certAddress}))
                (
                  <Input placeholder='请输入详细地址' maxLength={100}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>营业执照照片</p>
              <div style={certStyle}>
                <UploadImg imgPath={img1} onChange={(e)=>this.valueChanged('img1', e)}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>法人证件正面照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img2} onChange={(e)=>this.valueChanged('img2', e)}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>法人证件背面照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img3} onChange={(e)=>this.valueChanged('img3', e)}/>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>门店抬头照片</p>
              <div style={certStyle}>
                <UploadImg imgPath={img4} onChange={(e)=>this.valueChanged('img4', e)}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>门店内部场景照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img5} onChange={(e)=>this.valueChanged('img5', e)}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>门店产品照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img6} onChange={(e)=>this.valueChanged('img6', e)}/>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>门店收银台照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img7} onChange={(e)=>this.valueChanged('img7', e)}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>渠道协议合同照</p>
              <div style={certStyle}>
                <UploadImg imgPath={img8} onChange={(e)=>this.valueChanged('img8', e)}/>
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
            <Button type="primary" onClick={this.handleSubmit}>变 更</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditCertPage);
export default EditFormPage