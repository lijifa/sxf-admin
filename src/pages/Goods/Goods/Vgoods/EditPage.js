import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import DevBrandSelect from '@/components/TKDevBrandSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const modelStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'},
  {key: 9, value: '注销'}
]
const modelTypeSelect = [
  {key: 0, value: 'POS'},
  {key: 1, value: '收银机'},
  {key: 2, value: '自助机'}
]

const modelPinpadSelect = [
  {key: -1, value: '无'},
  {key: 0, value: '集成'},
]

const modelPrinterSelect = [
  {key: -1, value: '无'},
  {key: 0, value: '集成'},
]
const namespace = 'devmodel';
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
        devbrandMapId,
        modelCode,
        modelStatus,
        modelType,
        modelPinpad,
        modelPrinter,
        modelPrice1,
        modelPrice2,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        devbrandMapId,
        modelCode,
        modelStatus,
        modelType,
        modelPinpad,
        modelPrinter,
        modelPrice1,
        modelPrice2,
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
              <FormItem label='品牌'>
                {getFieldDecorator('devbrandMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.devbrandMapId : ''}))
                (
                  <DevBrandSelect placeholder='请选择品牌'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='型号分类'>
                {getFieldDecorator('modelType', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.modelType : 0}))
                (
                  <StatusSelect options={modelTypeSelect} placeholder='请选择型号分类'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='型号代码'>
                {getFieldDecorator('modelCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.modelCode : ''}))
                (
                  <Input placeholder='请输入型号代码'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='打印机'>
                {getFieldDecorator('modelPrinter', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.modelPrinter : -1}))
                (
                  <StatusSelect options={modelPrinterSelect} placeholder='请选择打印机'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='密码键盘'>
                {getFieldDecorator('modelPinpad', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.modelPinpad : -1}))
                (
                  <StatusSelect options={modelPinpadSelect} placeholder='请选择密码键盘'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='启用状态'>
                {getFieldDecorator('modelStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.modelStatus : 0}))
                (
                  <StatusSelect options={modelStatusSelect} placeholder='请选择启用状态'/>
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

const EditFormPage = Form.create()(EditPage);
export default EditFormPage