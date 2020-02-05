import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import CitySelect from '@/components/TKCitySelect';
import styles from './styles.less';
const FormItem = Form.Item;
const devBrandStatusSelect =  [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'},
  {key: 9, value: '注销'}
]
const namespace = 'devbrand';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {

  state = {
    commRegionId: '156',
    commCityCountyId: '',
    commCityCountyName: '',
    commCityName: '',
    commCityProvName: '',
    commCityZipId: ''
  }

  componentDidMount () {
    const { detailData } = this.props
    if(!detailData){
      return;
    }

    this.setState({
      commRegionId: detailData ? detailData.commRegionId : '156',
      commCityCountyId: detailData ? detailData.commCityCountyId : '',
      commCityCountyName: detailData ? detailData.commCityCountyName : '',
      commCityName: detailData ? detailData.commCityName : '',
      commCityProvName: detailData ? detailData.commCityProvName : '',
      commCityZipId: detailData ? detailData.commCityZipId : ''
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

  getCityData = (e) => {
    let lastData = e[e.length-1]
    this.setState({
      commRegionId: lastData.regionId,
      commCityCountyId: lastData.id,
      commCityCountyName: e[1] ? e[1].name : '',
      commCityName: e[2] ? e[2].name : '',
      commCityProvName: e[0].name,
      commCityZipId: lastData.cityZip,
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { 
      commRegionId,
      commCityCountyId,
      commCityCountyName,
      commCityName,
      commCityProvName,
      commCityZipId
    } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        devbrandMapId,
        devbrandName,
        devbrandStatus,
        // commRegionId,
        // commCityCountyId,
        // commCityCountyName,
        // commCityName,
        // commCityProvName,
        // commCityZipId,
        commAddress,
        commName,
        commMobile,
        commTel,
        commFax,
        commEmail,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        devbrandMapId,
        devbrandName,
        devbrandStatus,
        commRegionId,
        commCityCountyId,
        commCityCountyName,
        commCityName,
        commCityProvName,
        commCityZipId,
        commAddress,
        commName,
        commMobile,
        commTel,
        commFax,
        commEmail,
        dataReserve,
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
    const { commCityZipId } = this.state;
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='品牌ID'>
                {getFieldDecorator('devbrandMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.devbrandMapId : ''}))
                (
                  <Input placeholder='请输入品牌ID'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='品牌名称'>
                {getFieldDecorator('devbrandName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.devbrandName : ''}))
                (
                  <Input placeholder='请输入通讯索引ID'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='启用状态'>
                {getFieldDecorator('devbrandStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.devbrandStatus : 0}))
                (
                  <StatusSelect options={devBrandStatusSelect} placeholder='请输入启用状态'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='联系人'>
                {getFieldDecorator('commName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commName : ''}))
                (
                  <Input placeholder='请输入联系人'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='地址'>
                {getFieldDecorator('commCityCountyId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commCityCountyId : ''}))
                (
                  <CitySelect placeholder='请选择城市名称' onChange={(e) => this.getCityData(e)} editValue={detailData ? this.getCityStr(detailData, 'array') : ''}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='详细地址'>
                {getFieldDecorator('commAddress', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commAddress : ''}))
                (
                  <Input placeholder='请输入详细地址'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='邮政编码'>
                {getFieldDecorator('commCityZipId', Object.assign({}, decoratorConfig, {initialValue: commCityZipId}))
                (
                  <Input placeholder='请输入邮政编码'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='联系手机'>
                {getFieldDecorator('commMobile', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commMobile : ''}))
                (
                  <Input placeholder='请输入联系手机'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='联系电话'>
                {getFieldDecorator('commTel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commTel : ''}))
                (
                  <Input placeholder='请输入联系电话'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='联系传真'>
                {getFieldDecorator('commFax', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commFax : ''}))
                (
                  <Input placeholder='请输入联系传真'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='电子邮件'>
                {getFieldDecorator('commEmail', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.commEmail : ''}))
                (
                  <Input placeholder='请输入电子邮件'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='备注'>
                {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (<Input.TextArea rows={4} placeholder='请输入备注' />)}
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