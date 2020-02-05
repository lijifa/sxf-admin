import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import DevBrandSelect from '@/components/TKDevBrandSelect';
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

class EditPage extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        deviceSn,
        devbrandMapId,
        modelCode,
        deviceStatus,
        deviceAttach,
        instMapId,
        partnerMapIdP,
        partnerMapId,
        devBatchId,
        deviceToken,
        casherNo,
        posMapId,
        shopMapId,
        posNo,
        merNo,
        merMapId,
        merMapIdP
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        deviceSn,
        devbrandMapId,
        modelCode,
        deviceStatus,
        deviceAttach,
        instMapId,
        partnerMapIdP,
        partnerMapId,
        devBatchId,
        deviceToken,
        casherNo,
        posMapId,
        shopMapId,
        posNo,
        merNo,
        merMapId,
        merMapIdP,
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
            <Col span={16}>
              <FormItem label='归属' className='singleFormItem' >
                {detailData.instMapId} XXX渠道
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='品牌/型号' className='singleFormItem' >
                {detailData.instMapId} XXX品牌/型号
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='安装商户'>
                {detailData.instMapId} XXX商户
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='POS编号'>
                00001
              </FormItem>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='安装门店'>
                {getFieldDecorator('shopMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.shopMapId : ''}))
                (
                  <Input placeholder='请输入安装门店'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='款台号'>
                {getFieldDecorator('casherNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.casherNo : ''}))
                (
                  <Input placeholder='请输入款台号'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='状态'>
                {getFieldDecorator('deviceStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.deviceStatus : ''}))
                (
                  <Input placeholder='请输入交易拨号电话1'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='安装临时秘钥' className='singleFormItem' >
                {detailData.deviceToken}
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