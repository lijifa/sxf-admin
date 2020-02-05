import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Radio, Select } from "antd";
import {responseMsg, changeTime, getObjStatus} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import MccSelect from '@/components/TKMccSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import styles from './styles.less';
const FormItem = Form.Item;

const riskrunStatusSelect = [
  {key: '0', value: '正常'},
  {key: '1', value: '暂停'},
]


const merGradeSelect = [
  {key: '0', value: '无'},
  {key: '1', value: '优'},
  {key: '2', value: '良'},
  {key: '3', value: '合格'},
  {key: '4', value: '可疑'},
  {key: '5', value: '风险'},
]

const riskUptSelect = [
  {key: '0', value: '当天'},
  {key: '1', value: '一天'},
  {key: '7', value: '七天'},
  {key: '30', value: '三十天'},
]


const namespace = 'mgrade';
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
        riskrunStatus,
        merGrade,
        mccData,
        riskrunBound,
        riskUpt,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        instMapId,
        riskrunStatus,
        merGrade,
        mccIdP: mccData[0].id,
        mccId: mccData[1].id,
        riskrunBound,
        riskUpt,
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
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='机构'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (
                  <InstitudeSelect placeholder='请选择机构' />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='适用MCC'>
                {getFieldDecorator('mccData', Object.assign({}, decoratorConfig, {initialValue: detailData ? [detailData.mccNameP.toString(), detailData.mccName.toString()] : []}))
                (
                  <MccSelect allData={true} placeholder='请选择MCC'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='适用商户'>
                {getFieldDecorator('merGrade', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merGrade : ''}))
                (
                  <StatusSelect options={merGradeSelect} placeholder='请选择适用商户'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='评级周期'>
                {getFieldDecorator('riskUpt', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskUpt.toString() : ''}))
                (
                  <StatusSelect options={riskUptSelect} placeholder='请选择评级周期'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='调用积数'>
                {getFieldDecorator('riskrunBound', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskrunBound : ''}))
                (
                  <Input placeholder='请输入调用积数'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='状态'>
                {getFieldDecorator('riskrunStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskrunStatus.toString() : '0'}))
                (
                  <StatusSelect options={riskrunStatusSelect} placeholder='请选择启用状态'/>
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