import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Radio } from "antd";
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import RiskruleSelect from '@/components/RiskruleSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const ruleStatusSelect =  [
  {key: '0', value: '正常'},
  {key: '1', value: '暂停'},
]
const namespace = 'riskrule';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  state = {
    ruleId: this.props.detailData ? this.props.detailData.ruleId : '',
    ruleName: this.props.detailData ? this.props.detailData.ruleName : '',
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;
    const { ruleId, ruleName } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        instMapId,
        //ruleId,
        //ruleName,
        ruleType,
        ruleMode,
        ruleStatus,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        instMapId,
        ruleId,
        ruleName,
        ruleType,
        ruleMode,
        ruleStatus,
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
  
  onChangeRule = (e, o) => {
    this.setState({
      ruleId: o.ruleId,
      ruleName: o.ruleName
    })
  }

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    const matchRuleId = {
      rules: [{ required: true, message: '此项必填' }, {pattern: /(?:[0-9]|[1-9][0-9]|[1-9][0-9][0-9][0-9]|9999){4}/, message: '请输入1001-9999'}]
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
            <Col span={16}>
              <FormItem label='规则类型'>
                {getFieldDecorator('ruleType', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleType : '0'}))
                (
                  <Radio.Group name="radiogroup">
                    <Radio value={'0'}>实时</Radio>
                    <Radio value={'1'}>事后</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='算法模式'>
                {getFieldDecorator('ruleMode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleMode : '1'}))
                (
                  <Radio.Group name="radiogroup">
                    <Radio value={'1'}>百分比</Radio>
                    <Radio value={'2'}>绝对值</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='风控规则'>
                {getFieldDecorator('ruleName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleName : ''}))
                (
                  <RiskruleSelect
                    placeholder='请选择风控规则'
                    allData={true}
                    onChange={(e, o) => this.onChangeRule(e, o)}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            <Col span={12}>
              <FormItem label='规则ID'>
                {getFieldDecorator('ruleId', Object.assign({}, matchRuleId, {initialValue: detailData ? detailData.ruleId : ''}))
                (
                  <Input maxLength={4} placeholder='请输入规则ID'/>
                )}
              </FormItem>
            </Col>
          </Row> */}

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='状态'>
                {getFieldDecorator('ruleStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleStatus : '0'}))
                (
                  <StatusSelect options={ruleStatusSelect} placeholder='请输入启用状态'/>
                )}
              </FormItem>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            <Col span={24}>
              <FormItem label='规则名称'>
                {getFieldDecorator('ruleName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleName : ''}))
                (
                  <Input maxLength={20} placeholder='请输入规则名称'/>
                )}
              </FormItem>
            </Col>
          </Row> */}
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='备注'>
                {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (<Input.TextArea rows={4} maxLength={60} placeholder='请输入备注' />)}
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