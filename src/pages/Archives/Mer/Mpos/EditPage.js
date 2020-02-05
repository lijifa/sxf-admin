import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
import StatusSelect from '@/components/MsStatusSelect';
const FormItem = Form.Item;

const typeSelect = [
  {key: 'N', value: '无需更新'},
  {key: 'Y', value: '选择更新'}
]
const numsSelect = [
  {key: 0, value: '0'},
  {key: 1, value: '1'},
  {key: 2, value: '2'},
  {key: 3, value: '3'}
]
const posTransDefaultSelect = [
  {key: '0', value: '预授权'},
  {key: '1', value: '消费'}
]
const posConfirmModeSelect = [
  {key: '0', value: '都支持'},
  {key: '1', value: '请求'},
  {key: '2', value: '通知'}
]
const namespace = 'icpara';
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
      const values = {
        id: detailData ? detailData.id : '',
        icResData1: 0,
        icResData2: 0,
        ...fieldsValue
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
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='商户名称'>
                {getFieldDecorator('merName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merName : ''}))
                (<Input placeholder='请输入商户名称' disabled={detailData ? true : false}/>)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label='终端编号'>
                {getFieldDecorator('posNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posNo : ''}))
                (<Input placeholder='请输入终端编号' disabled={detailData ? true : false}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='批次号'>
                {getFieldDecorator('posBatch', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posBatch : 0}))
                (<Input placeholder='请输入批次号' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='流水号'>
                {getFieldDecorator('posTrace', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTrace : 0}))
                (<Input placeholder='请输入流水号' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='交易超时时间'>
                {getFieldDecorator('posTimeout', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTimeout : 60}))
                (<Input placeholder='请输入交易超时时间(秒)' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='打印票据单份数'>
                {getFieldDecorator('posTicketnums', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTicketnums : 2}))
                (<StatusSelect options={numsSelect} placeholder='请选择打印票据单份数' />)}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='回响周期'>
                {getFieldDecorator('posEchotime', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posEchotime : 3600}))
                (<Input placeholder='请输入回响周期(秒)' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='通讯里发次数'>
                {getFieldDecorator('posCommRetry', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posCommRetry : 3}))
                (<StatusSelect options={numsSelect} placeholder='请选择打印票据单份数' />)}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='交易里发次数'>
                {getFieldDecorator('posTransRetry', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTransRetry : 3}))
                (<StatusSelect options={numsSelect} placeholder='请选择交易里发次数' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='通讯参数索引'>
                {getFieldDecorator('comIndex', Object.assign({}, {}, {initialValue: detailData ? detailData.comIndex : 1}))
                (<StatusSelect options={numsSelect} placeholder='请选择通讯参数索引' />)}
              </FormItem>
            </Col>
          </Row>
          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='单笔限额'>
                {getFieldDecorator('posMaxamt', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posMaxamt : 0.00}))
                (<Input placeholder='请输入单笔限额' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='累计存储笔数'>
                {getFieldDecorator('posMaxcnt', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posMaxcnt : 0.00}))
                (<Input placeholder='请输入累计存储笔数' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='退货交易限额'>
                {getFieldDecorator('posMaxrefundamt', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posMaxrefundamt : 0.00}))
                (<Input placeholder='请输入退货交易限额' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='默认交易'>
                {getFieldDecorator('posTransDefault', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTransDefault : '1'}))
                (<StatusSelect options={posTransDefaultSelect} placeholder='请输入默认支持的交易' />)}

              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='预授权完成方式'>
                {getFieldDecorator('posConfirmMode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posConfirmMode : '1'}))
                (<StatusSelect options={posConfirmModeSelect} placeholder='请输入预授权完成方式' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='刷卡标志'>
                {getFieldDecorator('posCardflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.icLeastAmt : 1}))
                (<Input placeholder='请输入刷卡标志' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='密码输入标志'>
                {getFieldDecorator('posPinflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.icCashLimitAmt : 1}))
                (<Input placeholder='请输入密码输入标志' />)}
              </FormItem>
            </Col>
          </Row>
          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='IC卡公钥更新'>
                {getFieldDecorator('posPbockeyflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posPbockeyflag : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请输入IC卡公钥更新' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='IC卡参数更新'>
                {getFieldDecorator('posPbocparaflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posPbocparaflag : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请输入IC卡参数更新' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='IC卡黑名单更新'>
                {getFieldDecorator('posHmdflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posHmdflag : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请输入IC卡黑名单更新' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='终端参数更新'>
                {getFieldDecorator('posParaflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posParaflag : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请输入终端参数更新' />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='POS程序更新'>
                {getFieldDecorator('posProgflag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posProgflag : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请选择POS程序更新方式' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='POS程序最新版本'>
                {getFieldDecorator('posNewprogver', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posNewprogver : 100}))
                (<StatusSelect options={typeSelect} placeholder='请输入POS程序最新版本' />)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='手工输入卡号'>
                {getFieldDecorator('posManMode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posManMode : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请选择是否支持' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='自动签退'>
                {getFieldDecorator('posLogout', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posLogout : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请选择是否支持' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='小费支持'>
                {getFieldDecorator('posTip', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTip : 'Y'}))
                (<StatusSelect options={typeSelect} placeholder='请选择是否支持' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='小费比例'>
                {getFieldDecorator('posTipPer', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.posTipPer : '10%'}))
                (<Input placeholder='请输入小费比例' />)}
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