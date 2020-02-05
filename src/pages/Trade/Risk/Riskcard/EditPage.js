import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, DatePicker, Select } from 'antd';
import moment from 'moment'
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import BankSelect from '@/components/TKBankSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const blackFlagSelect =  [
  {key: 0, value: '白名单'},
  {key: 9, value: '黑名单'}
]

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const namespace = 'card';
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
        cardNo,
        cardExp,
        bankId,
        blackFlag,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        cardNo,
        cardExp: moment(cardExp).format('YYMM'),
        bankId,
        blackFlag,
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

    const matchingNumber = {
      rules: [{ required: true, message: '此项必填' }, {pattern: /^[0-9]*$/, message: '数据输入不规范'}]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='帐号/卡号'>
                {getFieldDecorator('cardNo', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.cardNo : ''}))
                (
                  <Input placeholder='请输入帐号/卡号'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='帐号/卡号有效期 '>
                {getFieldDecorator('cardExp', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardExp : ''}))
                (
                  <MonthPicker style={{width: '100%'}} format={'YY/MM'} placeholder='请选择有效期'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='发卡方'>
                {getFieldDecorator('bankId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.bankId : ''}))
                (
                  <BankSelect placeholder='请选择发卡方'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='黑白标志'>
                {getFieldDecorator('blackFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.blackFlag : 0}))
                (
                  <StatusSelect options={blackFlagSelect} placeholder='请选择黑白标志'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='备注'>
                {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (<Input.TextArea rows={4} maxLength={80} placeholder='请输入备注' />)}
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