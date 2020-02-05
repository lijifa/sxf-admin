import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, DatePicker, Select, Radio } from "antd";
import {responseMsg, changeTime} from '@/utils/utils';
import InstitudeSelect from '@/components/TkInstitudeSelect';
import styles from './styles.less';
const FormItem = Form.Item;

const namespace = 'poscomm';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class InstallPage extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        instMapId,
        comIndex,
        comName,
        comTransapn,
        comTransapnusr,
        comTransapnpwd,
        comTransgateway,
        comTransip,
        comTransport,
        comTranstel1,
        comTranstel2,
        comTranstel3,
        comManapn,
        comManapnusr,
        comManapnpwd,
        comMangateway,
        comManip,
        comManport,
        comMantel1,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        instMapId,
        comIndex,
        comName,
        comTransapn,
        comTransapnusr,
        comTransapnpwd,
        comTransgateway,
        comTransip,
        comTransport,
        comTranstel1,
        comTranstel2,
        comTranstel3,
        comManapn,
        comManapnusr,
        comManapnpwd,
        comMangateway,
        comManip,
        comManport,
        comMantel1,
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
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='归属'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (
                  <Select placeholder='请选择品牌'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='品牌'>
                {getFieldDecorator('comIndex', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comIndex : ''}))
                (
                  <Select placeholder='请选择型号'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='型号'>
                {getFieldDecorator('comIndex', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comIndex : ''}))
                (
                  <Select placeholder='请选择型号'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='设备序列号'>
                {getFieldDecorator('comName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comName : ''}))
                (
                  <Input placeholder='请输入设备序列号'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='安装商户'>
                {getFieldDecorator('comMangateway', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comMangateway : ''}))
                (
                  <Select placeholder='归属'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='POS编号'>
                {getFieldDecorator('comMangateway', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comMangateway : ''}))
                (
                  <Input placeholder='输入POS编号'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='安装门店'>
                {getFieldDecorator('comManip', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comManip : ''}))
                (
                  <Select placeholder='请选择安装门店'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='款台号'>
                {getFieldDecorator('comManip', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comManip : ''}))
                (
                  <Select placeholder='请选择款台号'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='安装临时密钥'>
                {getFieldDecorator('comMangateway', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comMangateway : ''}))
                (
                  <Input placeholder='输入POS编号'/>
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
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const InstallFormPage = Form.create()(InstallPage);
export default InstallFormPage