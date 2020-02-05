import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from 'antd';
import {responseMsg, covertMoney2Yuan, getObjStatus} from '@/utils/utils';
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

class DetailPage extends Component {
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

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='商户名称' className='singleFormItem' >
                {detailData.merName}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label='终端编号' className='singleFormItem' >
                {detailData.posNo}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='批次号' className='singleFormItem' >
                {detailData.posBatch}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='流水号' className='singleFormItem' >
                {detailData.posTrace}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='交易超时时间' className='singleFormItem' >
                {detailData.posTimeout} s
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='打印票据单份数' className='singleFormItem' >
                {detailData.posTicketnums}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='回响周期' className='singleFormItem' >
                { detailData.posEchotime } s
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='通讯里发次数' className='singleFormItem' >
                {detailData.posCommRetry}
              </FormItem>
            </Col>

            <Col span={6}>
              <FormItem label='交易里发次数' className='singleFormItem' >
                { detailData.posTransRetry }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='通讯参数索引' className='singleFormItem' >
                { detailData.comIndex }
              </FormItem>
            </Col>
          </Row>
          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='单笔限额' className='singleFormItem' >
                { covertMoney2Yuan(detailData.posMaxamt) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='累计存储笔数' className='singleFormItem' >
                { detailData.posMaxcnt }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='退货交易限额' className='singleFormItem' >
                { covertMoney2Yuan(detailData.posMaxrefundamt) }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='默认交易' className='singleFormItem' >
                { getObjStatus(posTransDefaultSelect, detailData.posTransDefault) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='预授权完成方式' className='singleFormItem' >
                { getObjStatus(posConfirmModeSelect, detailData.posConfirmMode) }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='刷卡标志' className='singleFormItem' >
                { detailData.posCardflag }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='密码输入标志' className='singleFormItem' >
                { detailData.posPinflag }
              </FormItem>
            </Col>
          </Row>
          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='IC卡公钥更新' className='singleFormItem' >
                { detailData.posPbockeyflag }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='IC卡参数更新' className='singleFormItem' >
                { detailData.posPbocparaflag }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='IC卡黑名单更新' className='singleFormItem' >
                { detailData.posHmdflag }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='终端参数更新' className='singleFormItem' >
                { detailData.posParaflag }
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='POS程序更新' className='singleFormItem' >
                { detailData.posProgflag }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='POS程序最新版本' className='singleFormItem' >
                { detailData.posNewprogver }
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={6}>
              <FormItem label='手工输入卡号' className='singleFormItem' >
                { detailData.posManMode }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='自动签退' className='singleFormItem' >
                { detailData.posLogout }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='小费支持' className='singleFormItem' >
                { detailData.posTip }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label='小费比例' className='singleFormItem' >
                { detailData.posTipPer }
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
          </div>
        </Form>
      </div>
    );
  }
}

const DetailFormPage = Form.create()(DetailPage);
export default DetailFormPage