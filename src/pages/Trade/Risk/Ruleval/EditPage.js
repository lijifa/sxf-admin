import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Radio, Select } from "antd";
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import MccSelect from '@/components/TKMccSelect';
import RiskruleSelect from '@/components/RiskruleSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const riskStatusSelect = [
  {key: '0', value: '正常'},
  {key: '1', value: '暂停'},
]
const riskTSelect = [
  {key: '0', value: '当天'},
  {key: '1', value: '一天'},
  {key: '7', value: '七天'},
  {key: '30', value: '三十天'},
]
const merGradeSelect = [
  {key: '0', value: '所有'},
  {key: '1', value: '优'},
  {key: '2', value: '良'},
  {key: '3', value: '合格'},
  {key: '4', value: '可疑'},
  {key: '5', value: '风险'},
]
const riskActiveSelect = [
  {key: '1', value: '可疑风险'},
  {key: '2', value: '中度风险'},
  {key: '3', value: '高危风险'},
  {key: '9', value: '拒绝'},
]

const riskRuleTSelect = [
  {key: 2001, value: '大额交易指数'},
  {key: 2002, value: '低额交易比例指数'},
  {key: 2003, value: '整额交易比例指数'},
  {key: 2004, value: '手输交易比例指数'},
  {key: 2005, value: '退货交易比例指数'},
  {key: 2006, value: '调单比例指数'},
  {key: 2007, value: '退单比例指数'},
  {key: 2008, value: '非营业时间交易比例'},
  {key: 2009, value: '失败交易比例指数'},
  {key: 2010, value: '密码错误比例指数'},
  {key: 2011, value: '查余额比例'},
  {key: 2012, value: '最低消费金额'},
]



const namespace = 'ruleval';
// const mapStateToProps = (state) => {
//   const result = state[namespace].editRes;
//   return {
//     result
//   };
// };
// @connect(mapStateToProps)


@connect(({ ruleval, riskrule, loading }) => ({
  result: ruleval.editRes,
  ruleResult: riskrule.selectData,
  loading: loading.effects['riskrule/queryAll'] ? true : false,
}))
class EditPage extends Component {
  state = {
    instMapId: '',
    ruleSelect: []
  }

  getRuleData = () => {
    const { dispatch } = this.props;
    const { instMapId } = this.state
    dispatch({
      type: `riskrule/queryAll`,
      payload: {
        instMapId: instMapId
      }
    }).then(()=>{
      console.log('=========')
      console.log(this.props)
      let options = [], opArr = []
        options = this.props.ruleResult.data;
        opArr = options.map( (item) => {
          return {key: item.ruleId, value: item.ruleName}
        })
      
      this.setState({
        ruleSelect: opArr
      })
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        instMapId,
        ruleId,
        riskStatus,
        riskT,
        merGrade,
        mccData,
        riskPara,
        riskTarget,
        activeBound,
        riskActive,
        dataReserve,
      } = fieldsValue

      const values = {
        id: detailData ? detailData.id : '',
        instMapId,
        ruleId,
        riskStatus,
        riskT,
        merGrade,
        mccIdP: mccData[0].id,
        mccId: mccData[1].id,
        riskPara,
        riskTarget,
        activeBound,
        riskActive,
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

  onInstChange = (e) => {
    console.log('----======')
    console.log(e)
    this.setState({
      instMapId: e
    }, () => {
      this.getRuleData()
    })
  }

  render() {
    const { detailData } = this.props;
    const { ruleSelect } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    const matchingNumber = {
      rules: [{ required: true, message: '此项必填' }, {pattern: /^[0-9]*$/, message: '数据输入不规范'}]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='机构'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (
                  <InstitudeSelect placeholder='请选择机构' onChange={(e) => this.onInstChange(e)}/>
                )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={12}>
              <FormItem label='风控规则'>
                {getFieldDecorator('ruleId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleId : ''}))
                (
                  <RiskruleSelect placeholder='请选择风控规则' instMapId={instMapId}/>
                )}
              </FormItem>
            </Col>
          </Row> */}

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='风控规则'>
                {getFieldDecorator('ruleId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ruleId : ''}))
                (
                  <StatusSelect options={ruleSelect} placeholder='请选择风控规则'/>
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
                {getFieldDecorator('merGrade', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merGrade.toString() : ''}))
                (
                  <StatusSelect options={merGradeSelect} placeholder='请选择适用商户'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='风控周期'>
                {getFieldDecorator('riskT', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskT.toString() : ''}))
                (
                  <StatusSelect options={riskTSelect} placeholder='请选择风控规则'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='风险参数'>
                {getFieldDecorator('riskPara', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.riskPara : ''}))
                (
                  <Input placeholder='请输入风险参数'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='阈值'>
                {getFieldDecorator('riskTarget', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.riskTarget : ''}))
                (
                  <Input addonAfter='%' placeholder='请输入阈值'/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='积数'>
                {getFieldDecorator('activeBound', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.activeBound : ''}))
                (
                  <Input placeholder='请输入积数'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='处理动作'>
                {getFieldDecorator('riskActive', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskActive.toString() : '1'}))
                (
                  <StatusSelect options={riskActiveSelect} placeholder='请选择处理动作'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='状态'>
                {getFieldDecorator('riskStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.riskStatus.toString() : '0'}))
                (
                  <StatusSelect options={riskStatusSelect} placeholder='请选择状态'/>
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