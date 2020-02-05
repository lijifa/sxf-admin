import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const channelFlagSelect =  [
  {key: 2, value: '2位'},
  {key: 3, value: '3位'}
]
const namespace = 'coin';
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
      const { coinId, coinName, coinCode, coinSymbol, coinUnit, coinPoint } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        coinId,
        coinName,
        coinCode,
        coinSymbol,
        coinUnit,
        coinPoint
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
          <FormItem className='inputW160' label='币种名称'>
            {getFieldDecorator('coinName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinName : ''}))
            (
              <Input placeholder='请输入币种名称' />
            )}
          </FormItem>

          <FormItem className='inputW160' label='币种数字代码'>
            {getFieldDecorator('coinId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinId : ''}))
            (
              <Input placeholder='请输入币种数字代码' />
            )}
          </FormItem>

          <FormItem className='inputW160' label='币种字母代码'>
            {getFieldDecorator('coinCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinCode : ''}))
            (
              <Input placeholder='请输入币种字母代码' />
            )}
          </FormItem>

          <FormItem className='inputW160' label='币种符号'>
            {getFieldDecorator('coinSymbol', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinSymbol : ''}))
            (
              <Input placeholder='请输入币种数字代码' />
            )}
          </FormItem>

          <FormItem className='inputW160' label='币种单位'>
            {getFieldDecorator('coinUnit', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinUnit : ''}))
            (
              <Input placeholder='请输入币种数字代码' />
            )}
          </FormItem>

          <FormItem className='inputW160' label='小数点位数'>
            {getFieldDecorator('coinPoint', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinPoint : 2}))
            (
              <StatusSelect options={channelFlagSelect} placeholder='请选择小数点位数' />
            )}
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