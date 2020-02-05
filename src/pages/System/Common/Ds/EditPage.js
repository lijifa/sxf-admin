import { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { Form, Button, Input, DatePicker } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const namespace = 'holiday';
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
        instMapId,
        holidayDateSys,
        settleDateSys,
        dataReserve,
     } = fieldsValue
      //let date= holidayDateSys ? changeTime(holidayDateSys[0], holidayDateSys[1]) : ''
      const values = {
        id: detailData ? detailData.id : '',
        //beginTime: holidayDateSys ? holidayDateSys[0].format('YYYYMMDD') : '',
        //endTime:  holidayDateSys ? holidayDateSys[1].format('YYYYMMDD') : '',
        holidayDateSys: holidayDateSys.format('YYYYMMDD'),
        instMapId,
        settleDateSys: settleDateSys.format('YYYYMMDD'),
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
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <FormItem label='归属机构'>
            {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
            (<InstitudeSelect placeholder='请选择归属机构' />)}
          </FormItem>
          <FormItem label='节日假日'>
            {getFieldDecorator('holidayDateSys', Object.assign({}, decoratorConfig, {initialValue: detailData ? moment(detailData.holidayDateSys, 'YYYYMMDD') : moment()}))
            (
              <DatePicker />
            )}
          </FormItem>
          {/* <FormItem label='节假日日期'>
            {getFieldDecorator('holidayDateSys', Object.assign({}, decoratorConfig, {initialValue: detailData ? [moment(detailData.beginTime), moment(detailData.endTime)] : ''}))
            (
              <RangePicker />
            )}
          </FormItem> */}
          <FormItem label='清算日期/上班日期'>
            {getFieldDecorator('settleDateSys', Object.assign({}, decoratorConfig, {initialValue: detailData ? moment(detailData.settleDateSys, 'YYYYMMDD') : moment()}))
            (
              <DatePicker />
            )}
          </FormItem>

          <FormItem label='备注'>
            {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
            (<Input.TextArea rows={4} placeholder='在这里添加内容' />)}
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