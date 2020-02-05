import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Select } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import RegionSelect from '@/components/TKRegionSelect';
import LangSelect from '@/components/TKLangSelect';
import UploadImg from '@/components/MSupload';
import styles from './styles.less';
const FormItem = Form.Item;
const namespace = 'bank';
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
      const { langCode, bankId, bankName, regionId, bankIcon, dataReserve} = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        langCode,
        bankId,
        bankIcon,
        bankName,
        regionId,
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

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    const  shopMapIds = []
    if (detailData && detailData.shopIds) {
      detailData.shopIds.split(',').map((item)=>{
        shopMapIds.push(Number(item))
      })
    }
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <FormItem className='inputW210' label='数字代码'>
            {getFieldDecorator('bankId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.bankId : ''}))
            (
              <Input placeholder='请输入数字代码' />
            )}
          </FormItem>

          <FormItem className='inputW210' label='所在国家/地区'>
            {getFieldDecorator('regionId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.regionId : ''}))
            (
              <RegionSelect placeholder='请选择所在国家/地区' />
            )}
          </FormItem>

          <FormItem className='inputW210' label='语言语种'>
            {getFieldDecorator('langCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.langCode : ''}))
            (
              <LangSelect placeholder='请选择语言语种' />
            )}
          </FormItem>

          <FormItem className='inputW210' label='银行名称'>
            {getFieldDecorator('bankName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.bankName : ''}))
            (
              <Input placeholder='请输入银行名称' />
            )}
          </FormItem>

          <FormItem className='inputW210' label='国家旗帜'>
            {getFieldDecorator('bankIcon', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.bankIcon : ''}))
            (
              <UploadImg imgPath={detailData ? detailData.bankIcon : ''}/>
            )}
            <p style={{color:'red'}} >尺寸：100x100</p>
          </FormItem>

          <FormItem className='inputW210' label='备注'>
            {getFieldDecorator('dataReserve', Object.assign({}, {initialValue: detailData ? detailData.dataReserve : ''}))
            (
              <Input.TextArea rows={4} placeholder='请输入备注' />
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