import { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { Form, Button, Input, Select, Row, Col, DatePicker  } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import TKInstitudeSelect from '@/components/TKInstitudeSelect';
import TKHostSelect from '@/components/TKHostSelect';
import StatusSelect from '@/components/MsStatusSelect';
import TKCoinSelect from '@/components/TKCoinSelect';
import CitySelect from '@/components/TKCitySelect';
import styles from './styles.less';

const settleTypeList =  [
  {key: '0', value: '代理模式'},
  {key: '1', value: '收单模式(二清)'}
]

const FormItem = Form.Item;
const namespace = 'insthost';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {

  state = {
    instMapId: this.props.detailData ? this.props.detailData.instMapId : '',
    hostMapId: this.props.detailData ? this.props.detailData.hostMapId : '',
    settleType: this.props.detailData ? this.props.detailData.settleType : '0',
    coinId: this.props.detailData ? this.props.detailData.coinId : '',
    commRegionId: this.props.detailData ? this.props.detailData.commRegionId : '',
    commCityId: this.props.detailData ? this.props.detailData.commCityId : '',
    commCityCountyName: this.props.detailData ? this.props.detailData.commCityCountyName : '',
    commCityName: this.props.detailData ? this.props.detailData.commCityName : '',
    commCityProvName: this.props.detailData ? this.props.detailData.commCityProvName : '',
    commCityProvName: this.props.detailData ? this.props.detailData.commCityProvName : '',
    commCityZip: this.props.detailData ? this.props.detailData.commCityZip : '',
  }

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
      if (partner.commCityName) {
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
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityName, partner.commCityCountyName]
      }
    }
    return cityStr
  }

  getCityData = (e) => {
    let lastData = e[e.length-1]
    this.setState({
      commRegionId: lastData.regionId,
      commCityId: lastData.id,
      commCityCountyName: e[2] ? e[2].name : '',
      commCityName: e[1] ? e[1].name : '',
      commCityProvName: e[0].name,
      commCityZip: lastData.cityZip,
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { instHostCode, contractNo, contractExp, certName, certAddress, certTaxNo, certLpName, certLpId, commCityZip, commAddress, commMan, commMobile, commEmail, commTel, commFax, coinId} = fieldsValue
      const { instMapId, hostMapId, settleType, commRegionId, commCityId, commCityCountyName, commCityName, commCityProvName} = this.state
      const values = {
        id: detailData ? detailData.id : '',
        instMapId,
        hostMapId,
        instHostCode,
        hostStatus: 0,
        settleType,
        openPaytype: 0,
        contractNo,
        contractExp: moment(contractExp).valueOf(),
        coinId,
        certName,
        certAddress,
        certTaxNo,
        certLpName,
        certLpId,
        commRegionId,
        commCityId,
        commCityCountyName,
        commCityName,
        commCityProvName,
        commCityZip,
        commAddress,
        commMan,
        commMobile,
        commTel,
        commFax,
        commEmail,
      };

      dispatch({
        type: detailData ? `${namespace}/update` : `${namespace}/add`,
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

  render() {
    const { detailData } = this.props;
    const { commCityZip } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='归属机构'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : []}))
                  (<TKInstitudeSelect
                    placeholder='请选择归属机构'
                    onChange={(val)=>{ this.setState({ instMapId: val }) }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='归属通道'>
                {getFieldDecorator('hostMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMapId : ''}))
                (<TKHostSelect
                  placeholder='请选择归属通道'
                  onChange={(val)=>{ this.setState({ hostMapId: val }) }}
                />
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='通道分配机构编号'>
                {getFieldDecorator('instHostCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instHostCode : 0}))
                (<Input placeholder='请输入通道分配机构编号' maxLength={11}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='清算模式'>
                {getFieldDecorator('settleType', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.settleType : ['0']}))
                  (<StatusSelect
                    options={settleTypeList}
                    placeholder='请选择清算模式'
                    onChange={(val)=>{ this.setState({ settleType: val }) }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='结算币种'>
                {getFieldDecorator('coinId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinId : 156}))
                  (<TKCoinSelect placeholder='请选择结算币种' />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='合同编号'>
                {getFieldDecorator('contractNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.contractNo : ''}))
                (<Input placeholder='请输入合同编号' maxLength={30}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='合同到期'>
                {getFieldDecorator('contractExp', Object.assign({}, decoratorConfig, {initialValue: detailData ? moment(detailData.contractExp) : moment()}))
                (<DatePicker />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='联系人'>
                {getFieldDecorator('commMan', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commMan : ''}))
                (<Input placeholder='请输入联系人' maxLength={10}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='联系手机'>
                {getFieldDecorator('commMobile', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commMobile : ''}))
                (<Input placeholder='请输入联系手机' maxLength={11}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='所在城市'>
                {getFieldDecorator('commCityId', Object.assign({}, decoratorConfig, {initialValue: detailData ? this.getCityStr(detailData, 'array') : []}))
                (
                  <CitySelect allData={true} placeholder='请选择城市名称' onChange={(e) => this.getCityData(e)} editValue={detailData ? this.getCityStr(detailData, 'array') : ''}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='详细地址'>
                {getFieldDecorator('commAddress', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commAddress : ''}))
                (<Input placeholder='请输入详细地址' maxLength={60}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='邮政编码'>
                {getFieldDecorator('commCityZip', Object.assign({}, decoratorConfig, {initialValue: commCityZip }))
                (<Input placeholder='请输入邮政编码' maxLength={6}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='Email'>
                {getFieldDecorator('commEmail', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commEmail : ''}))
                (<Input placeholder='请输入Email' maxLength={30}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='电话号码'>
                {getFieldDecorator('commTel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commTel : ''}))
                (<Input placeholder='请输入电话号码' maxLength={20}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='传真号码'>
                {getFieldDecorator('commFax', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commFax : ''}))
                (<Input placeholder='请输入传真号码' maxLength={20}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='企业名称'>
                {getFieldDecorator('certName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certName : ''}))
                (<Input placeholder='请输入企业名称' maxLength={30}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='企业注册地址'>
                {getFieldDecorator('certAddress', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certAddress : ''}))
                (<Input placeholder='请输入企业注册地址' maxLength={60}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='纳税人识别号'>
                {getFieldDecorator('certTaxNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certTaxNo : ''}))
                (<Input placeholder='请输入纳税人识别号' maxLength={30} />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='法人姓名'>
                {getFieldDecorator('certLpName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certLpName : ''}))
                (<Input placeholder='请输入法人姓名'  maxLength={20} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='法人身份证号'>
                {getFieldDecorator('certLpId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.certLpId : ''}))
                (<Input placeholder='请输入法人身份证号' maxLength={18} />)}
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
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage