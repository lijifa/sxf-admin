import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Radio } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import LangSelect from '@/components/TKLangSelect';
import UploadImg from '@/components/MSupload';
import styles from './styles.less';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';

const FormItem = Form.Item;
const RadioGroup = Radio.Group
const namespace = 'paytype';
@connect(({ paytype }) => ({
  result: paytype.editRes
}))

class EditPage extends Component {
  state = {
    paytypeIcon: this.props.detailData ? this.props.detailData.paytypeIcon : imgDemo
  }
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;
    const { paytypeIcon } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { 
        langCode,
        paytypeId,
        paytypeCode,
        //paytypeIdP,
        paytypeName,
        mdrType,
        dataReserve
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        langCode,
        paytypeId,
        paytypeCode,
        paytypeIdP:0,
        paytypeName,
        paytypeIcon,
        mdrType,
        dataReserve
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
  
  valueChanged = (key, value) => {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  render() {
    const { detailData } = this.props;
    const { paytypeIcon } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          
          <FormItem label='支付方式'>
            {getFieldDecorator('paytypeName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.paytypeName : ''}))
            (<Input placeholder='在这里添加支付方式' maxLength={24} disabled={detailData ? true : false}/>)}
          </FormItem>
          <FormItem label='支付方式ID'>
            {getFieldDecorator('paytypeId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.paytypeId : ''}))
            (<Input placeholder='在这里添加支付方式ID' maxLength={8} disabled={detailData ? true : false}/>)}
          </FormItem>
          <FormItem label='支付方式代码'>
            {getFieldDecorator('paytypeCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.paytypeCode : ''}))
            (<Input placeholder='在这里添加支付方式代码' maxLength={24}/>)}
          </FormItem>

          <FormItem label='语言语种'>
            {getFieldDecorator('langCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.langCode : 'zh_CN'}))
            (<LangSelect placeholder='请选择语言语种' />)}
          </FormItem>

          <FormItem label='手续费计算标志'>
            {getFieldDecorator('mdrType', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.mdrType : '0'}))
            (
              <RadioGroup >
                <Radio value={'0'}>总扣率</Radio>
                <Radio value={'1'}>分项扣率</Radio>
                <Radio value={'9'}>不计扣率</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem className='inputW210' label={<span>图标 <span style={{color:'red'}}>(100x100)</span></span>}>
            {getFieldDecorator('paytypeIcon', Object.assign({}, decoratorConfig, {initialValue: paytypeIcon}))
            (
              <UploadImg imgPath={paytypeIcon} onChange={(e)=>this.valueChanged('paytypeIcon', e)}/>
            )}
          </FormItem>

          <FormItem label='备注'>
            {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
            (<Input.TextArea rows={4} placeholder='在这里添加备注内容' maxLength={100}/>)}
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