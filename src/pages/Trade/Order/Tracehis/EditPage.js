import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
import StatusSelect from '@/components/MsStatusSelect';
import BankSelect from '@/components/TKBankSelect';
import CardTypeSelect from '@/components/TKCardTypeSelect';
const cdFlagSelect =  [
  {key: 0, value: '借记卡'},
  {key: 1, value: '贷记卡'},
  {key: 2, value: '准贷记卡'}
]
const cardTrackSelect =  [
  {key: 2, value: '二磁道'},
  {key: 3, value: '三磁道'}
]

const namespace = 'cardbin';
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
      const { cardBin, cardName, cardTrack, cardOff, cardLen, cardCd, cardType, bankId, dataReserve} = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        cardBin,
        cardName,
        cardTrack,
        cardOff,
        cardLen,
        cardCd,
        cardType,
        bankId,
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
          <FormItem label='卡类型'>
            {getFieldDecorator('cardType', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardType : ''}))
            (
              <CardTypeSelect placeholder='请选择卡片类型' />
            )}
          </FormItem>

          <FormItem label='银行名称'>
            {getFieldDecorator('bankId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.bankId : ''}))
            (
              <BankSelect placeholder='请选择银行名称'/>
            )}
          </FormItem>

          <FormItem label='卡BIN'>
            {getFieldDecorator('cardBin', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardBin : ''}))
            (
              <Input placeholder='请输入BIN' maxLength={16} />
            )}
          </FormItem>

          <FormItem label='卡片名称'>
            {getFieldDecorator('cardName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardName : ''}))
            (
              <Input placeholder='请输入卡片名称' />
            )}
          </FormItem>

          <FormItem label='借贷记'>
            {getFieldDecorator('cardCd', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardCd : 0}))
            (
              <StatusSelect options={cdFlagSelect} />
            )}
          </FormItem>

          <FormItem label='所在磁道'>
            {getFieldDecorator('cardTrack', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardTrack : 2}))
            (
              <StatusSelect options={cardTrackSelect} />
            )}
          </FormItem>

          <FormItem label='偏移位置'>
            {getFieldDecorator('cardOff', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardOff : 0}))
            (
              <Input placeholder='请输入偏移位置' maxLength={2} />
            )}
          </FormItem>

          <FormItem label='卡号长度'>
            {getFieldDecorator('cardLen', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cardLen : ''}))
            (
              <Input placeholder='请输入卡片长度' maxLength={2}/>
            )}
          </FormItem>

          <FormItem label='备注'>
            {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
            (<TextArea rows={4} placeholder="请输入备注"/>)}
            
          </FormItem>

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