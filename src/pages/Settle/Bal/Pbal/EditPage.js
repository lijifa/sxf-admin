import { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { Form, Button, Input, Select, Row, Col, DatePicker, Divider, Timeline  } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import styles from './styles.less';

const FormItem = Form.Item;
const ticketFlagList =  [
  {key: '-', value: '无'},
  {key: 'Y', value: '已开发票'},
  {key: 'N', value: '未开已开'},
]
const namespace = 'pbal';
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
        remitMoney,
        settleDate,
        ticketFlag,
        dataReserve,
      } = fieldsValue

      const values = {
        id: detailData ? detailData.id : '',
        remitMoney,
        settleDate: moment(settleDate).format('YYYYMMDD'),
        ticketFlag,
        dataReserve,
      };

      dispatch({
        type: `${namespace}/remitMoney`,
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
    const matchRuleId = {
      rules: [{ required: true, message: '此项必填' }, {pattern: /(?:[0-9]|[1-9][0-9]|[1-9][0-9][0-9][0-9]|9999){4}/, message: '请输入1001-9999'}]
    }
    
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
        fontWeight: 'bold'
    }
    
    //处理收款账户
    let mbankData = {}
    if (detailData.mbank && detailData.mbank.settleAcctType == 0) {
      //对公
      mbankData.settleAcctNo = detailData.mbank.settleAcctNo1
      mbankData.settleAcctName = detailData.mbank.settleAcctName1
      mbankData.settleBidName = detailData.mbank.settleBidName1
      mbankData.settleFee = detailData.mbank.settleFee
    } else if (detailData.mbank && detailData.mbank.settleAcctType == 1) {
      //对私
      mbankData.settleAcctNo = detailData.mbank.settleAcctNo2
      mbankData.settleAcctName = detailData.mbank.settleAcctName2
      mbankData.settleBidName = detailData.mbank.settleBidName2
      mbankData.settleFee = detailData.mbank.settleFee
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>渠道编号</p>
                <p style={detailText}>{ detailData.partnerMapId }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>渠道名称</p>
                <p style={detailText}>{ detailData.partnerName }</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>本批可结算金额</p>
                <p style={detailText}>{ detailData.aSettleBalMax }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>本批结算日期</p>
                <p style={detailText}>{ detailData.aSettleDateMax }</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>更新日期</p>
                <p style={detailText}>{ detailData.timeUpdate }</p>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>收款账户</p>
                <p style={detailText}>{ mbankData.settleAcctNo ? mbankData.settleAcctNo : '-' }</p>
              </div>
            </Col>
            <Col span={12}>
              <FormItem label='本次划拨金额'>
                {getFieldDecorator('remitMoney', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.remitMoney : ''}))
                (
                  <Input maxLength={10} placeholder='请输入本次划拨金额'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>收款户名</p>
                <p style={detailText}>{ mbankData.settleAcctName ? mbankData.settleAcctName : '-' }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>划拨手续费</p>
                <p style={detailText}>{ mbankData.settleFee ? mbankData.settleFee : '0.00' }</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>开户行</p>
                <p style={detailText}>{ mbankData.settleBidName ? mbankData.settleBidName : '-' }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>实际划拨金额</p>
                <p style={detailText}>{ '-' }</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='划拨时间'>
                {getFieldDecorator('settleDate', Object.assign({}, decoratorConfig, {initialValue: detailData ? moment(detailData.settleDate) : moment()}))
                (<DatePicker />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='开票状态'>
                {getFieldDecorator('ticketFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.ticketFlag : '-'}))
                (
                  <StatusSelect options={ticketFlagList} placeholder='请选择开票状态'/>
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