import { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import LangSelect from '@/components/TKLangSelect';
import MccLv1Select from '@/components/TKMccSelect/mccLv1';
import styles from './styles.less';
const FormItem = Form.Item;

const namespace = 'mcc';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {

  state = {
    mccIdP: 0,
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;
    const { mccIdP } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { 
        langCode,
        mccId,
        mccName
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        langCode,
        mccId,
        mccIdP,
        mccName,
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

  changeMccp = (e) => {
    this.setState({
      mccIdP: e
    })
  }

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }
    const matchingNumber = {
      rules: [{pattern: /^[0-9]*$/, message: formatMessage({ id: 'global.tips.onlynum' })},{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }
    const pleaseText = formatMessage({ id: 'global.input.please' })
    const pleaseChoose = formatMessage({ id: 'global.select.choose' })

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <FormItem label={formatMessage({ id: 'mcc.mccIdP' })}>
            {getFieldDecorator('mccIdP', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.mccIdP : 0}))(
              <MccLv1Select placeholder={pleaseChoose + formatMessage({ id: 'mcc.mccIdP' })} onChange={(e)=>this.changeMccp(e)} />
            )}
          </FormItem>
          
          <FormItem className='inputW160' label={formatMessage({ id: 'mcc.mccId' })}>
            {getFieldDecorator('mccId', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.mccId : ''}))
            (
              <Input maxLength={4} placeholder={pleaseText + formatMessage({ id: 'mcc.mccId' })} />
            )}
          </FormItem>

          <FormItem className='inputW160' label={ formatMessage({ id: 'mcc.langCode' })}>
            {getFieldDecorator('langCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.langCode : ''}))
            (<LangSelect placeholder={pleaseChoose + formatMessage({ id: 'mcc.langCode' })} />)}
          </FormItem>

          <FormItem className='inputW160' label={ formatMessage({ id: 'mcc.mccName' })}>
            {getFieldDecorator('mccName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.mccName : ''}))
            (<Input placeholder={pleaseChoose + formatMessage({ id: 'mcc.mccName' })} />)}
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