import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import { getObjStatus } from '@/utils/utils';
import styles from './styles.less';

const ruleTypeSelect =  [
  {key: '0', value: '实时'},
  {key: '1', value: '事后'},
]

const ruleModeSelect =  [
  {key: '1', value: '百分比'},
  {key: '2', value: '绝对值'},
]

const ruleStatusSelect =  [
  {key: '0', value: '正常'},
  {key: '1', value: '暂停'},
]

export default class DetailPage extends Component {

  constructor (props) {
    super(props)
  }

  render() {
    const { detailData } = this.props;

    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }

    return (
      <div className={styles.editFormItem} style={{padding: '0 20px', marginBottom: '28px'}}>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>划拨日期</p>
                <p style={detailText}>{detailData.settleDate}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>渠道编号</p>
                <p style={detailText}>{detailData.partnerMapId}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>渠道名称</p>
                <p style={detailText}>{detailData.partnerName}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>收款账户</p>
                <p style={detailText}>{detailData.settleAcctNo}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>收款户名</p>
                <p style={detailText}>{detailData.settleAcctName}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>开户行</p>
                <p style={detailText}>{detailData.settleBankName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>划拨金额</p>
                <p style={detailText}>{detailData.settleAmt_str}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>划拨手续费</p>
                <p style={detailText}>{detailData.settleFee_str}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>已开发票</p>
                <p style={detailText}>{detailData.ticketFlag_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>备注</p>
                <p style={detailText}>{detailData.dataReserve}</p>
              </div>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>创建时间</p>
                <p style={detailText}>{detailData.timeCreate}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>更新时间</p>
                <p style={detailText}>{detailData.timeUpdate}</p>
              </div>
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