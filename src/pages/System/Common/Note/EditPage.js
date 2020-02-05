import { Component } from 'react';
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import { connect } from 'dva';
import moment from 'moment'
import { Form, Button, Input, DatePicker, Radio } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
import 'braft-editor/dist/index.css'
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const namespace = 'notice';
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
      const { noticeDate, channelFlag, shopMapIds, noticeTitle, noticeDesc } = fieldsValue
      let date= noticeDate ? changeTime(noticeDate[0], noticeDate[1]) : ''
      const values = {
        id: detailData ? detailData.id : '',
        beginTime: date ? date[0] : '',
        endTime:  date ? date[1] : '',
        shopIds: shopMapIds.join(','),
        noticeTitle,
        noticeDesc: noticeDesc.toHTML(),
        channelFlag,
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
    const controls = [ 'font-size', 'bold', 'italic', 'underline', 'text-color', 'separator' ]

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
            <FormItem label='起止日期'>
              {getFieldDecorator('noticeDate', Object.assign({}, decoratorConfig, {initialValue: detailData ? [moment(detailData.beginTime), moment(detailData.endTime)] : ''}))
              (
                <RangePicker />
              )}
            </FormItem>

            <FormItem label='通知渠道'>
              {getFieldDecorator('channelFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.channelFlag.toString() : '0'}))
              (
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="0">全部</Radio.Button>
                  <Radio.Button value="1">仅餐厅</Radio.Button>
                  <Radio.Button value="2">仅OA</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem label='通知标题'>
              {getFieldDecorator('noticeTitle', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.noticeTitle : ''}))
              (<Input placeholder='在这里添加通知标题' />)}
            </FormItem>
            


            <FormItem label='通知内容'>
              <div style={{border: '1px solid #e8e8e8'}}>
                {getFieldDecorator('noticeDesc', Object.assign({}, decoratorConfig, {initialValue: detailData ? BraftEditor.createEditorState(detailData.noticeDesc) : ''}))
                (
                  <BraftEditor
                    className="my-editor"
                    contentStyle={{height: 130, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                    controls={controls}
                    placeholder="请输入通知内容"
                  />
                )}
              </div>
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