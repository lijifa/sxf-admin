import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const namespace = 'paykey';
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
      const values = {
        id: detailData ? detailData.id : '',
        keyMkIndex: 1,
        keyKekIndex: 1,
        keyKey0: '-',
        keyKey: '-',
        ...fieldsValue
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
            {/* <Col span={24}>
              <FormItem label='商户名称'>
                {getFieldDecorator('merName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merName : ''}))
                (<Input placeholder='请输入商户名称' disabled={true}/>)}
              </FormItem>
            </Col> */}

            <Col span={24}>
              <FormItem label='机构ID'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (<Input placeholder='请输入机构ID'  disabled={true}/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label='通道编号'>
                {getFieldDecorator('hostMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMapId : 0}))
                (<Input placeholder='请输入通道编号' disabled={true} />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label='对称密钥索引'>
                {getFieldDecorator('keyIndex', Object.assign({}, decoratorConfig, {initialValue: 0}))
                (<Input placeholder='请输入对称密钥索引' disabled={true}/>)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem label='主密钥'>
                {getFieldDecorator('keyMaster', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyMaster : ''}))
                (<Input placeholder='请输入主密钥' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='PIN密钥'>
                {getFieldDecorator('keyPin', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyPin : 0}))
                (<Input placeholder='请输入PIN密钥' />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='效验值'>
                {getFieldDecorator('keyPinValue', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyPinValue : ''}))
                (<Input placeholder='请输入效验值' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='MAC密钥'>
                {getFieldDecorator('keyMac', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyMac : 0}))
                (<Input placeholder='请选择MAC密钥' />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='效验值'>
                {getFieldDecorator('keyMacValue', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyMacValue : ''}))
                (<Input placeholder='请输入效验值' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='磁道密钥'>
                {getFieldDecorator('keyTrack', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyTrack : ''}))
                (<Input placeholder='请选择磁道密钥' />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='效验值'>
                {getFieldDecorator('keyTrackValue', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.keyTrackValue : ''}))
                (<Input placeholder='请输入效验值' />)}
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