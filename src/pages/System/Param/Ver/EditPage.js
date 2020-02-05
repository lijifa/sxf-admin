import { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const channelFlagSelect =  [
  {key: 2, value: '2'},
  {key: 3, value: '3'}
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
      rules: [{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }

    const matchingNumber = {
      rules: [{pattern: /^[0-9]*$/, message: formatMessage({ id: 'global.tips.onlynum' })},{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinName' })}>
            {getFieldDecorator('coinName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinName : ''}))
            (
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinName' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinId' })}>
            {getFieldDecorator('coinId', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.coinId : ''}))
            (
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinId' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinCode' })} >
            {getFieldDecorator('coinCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinCode : ''}))
            (
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinCode' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinSymbol' })}>
            {getFieldDecorator('coinSymbol', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinSymbol : ''}))
            (
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinSymbol' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinUnit' })}>
            {getFieldDecorator('coinUnit', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinUnit : ''}))
            (
              <Input placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinUnit' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={formatMessage({ id: 'coin.coinPoint' })}>
            {getFieldDecorator('coinPoint', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.coinPoint : 2}))
            (
              <StatusSelect options={channelFlagSelect} placeholder={formatMessage({ id: 'global.input.please' }) + formatMessage({ id: 'coin.coinPoint' })} />
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
              {formatMessage({ id: 'global.button.cancel' })}
            </Button>
            <Button type="primary" htmlType="submit">{formatMessage({ id: 'global.button.ok' })}</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage