import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import PoscommSelect from '@/components/TKPoscommSelect';
import MerSearch from '@/components/TKMerSelect/merSearch';
import styles from './styles.less';
const FormItem = Form.Item;
const channelFlagSelect =  [
  {key: 2, value: '2位'},
  {key: 3, value: '3位'}
]
const namespace = 'merchantpos';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  state = {
    merMapId: '',
    merName: '',
  };
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { merMapId, comIndex, posNum } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        merMapId, 
        comIndex,
        posNum
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
  //获取银行联行信息数据
  getMerData = (data) => {
    this.setState({
      merMapId: data.merMapId,
      merName: data.merName
    })
  }
  render() {
    const { detailData } = this.props;
    const { merMapId, merName } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <FormItem className='inputW210' label='安装商户'>
            {getFieldDecorator('merMapId', Object.assign({}, decoratorConfig, {initialValue: merMapId}))
            (
              <MerSearch
                placeholder="请输入安装商户"
                getmore={(data) => this.getMerData(data)}
                merName={merName}
              />
            )}
          </FormItem>

          <FormItem className='inputW210' label='POS终端数量'>
            {getFieldDecorator('posNum', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posNum : 0}))
            (
              <Input placeholder='请输入POS终端数量' maxLength={3}/>
            )}
          </FormItem>
          <FormItem className='inputW210' label='通讯参数'>
            {getFieldDecorator('comIndex', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.comIndex : ''}))
            (
              <PoscommSelect placeholder='请选择通讯参数' />
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