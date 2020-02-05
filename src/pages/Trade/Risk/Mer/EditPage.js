import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import CitySelect from '@/components/TKCitySelect';
import MerNoSelect from '@/components/MerNoSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const blackFlagSelect = [
  {key: 0, value: '白名单'},
  {key: 9, value: '黑名单'},
]
const namespace = 'mer';
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
        merNo,
        merName,
        blackFlag,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        merNo,
        // merName,
        blackFlag,
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
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='选择商户'>
                {getFieldDecorator('merNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merNo : ''}))
                (
                  <MerNoSelect placeholder='请选择商户'/>
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
                (<Input.TextArea rows={4} placeholder='请输入备注' />)}
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