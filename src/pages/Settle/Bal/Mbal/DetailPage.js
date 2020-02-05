import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import { getObjStatus } from '@/utils/utils';
import styles from './styles.less';

const ticketFlagList =  [
  {key: '-', value: '无'},
  {key: 'Y', value: '已开发票'},
  {key: 'N', value: '未开已开'},
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
      <div className={styles.editFormItem} style={{padding: '0 20px', marginBottom: '28px'}}>
        <Form layout='vertical'>
        <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户编号</p>
                <p style={detailText}>{ detailData.merNo }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>通道名称</p>
                <p style={detailText}>{ detailData.merName }</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>本批可结算金额</p>
                <p style={detailText}>{ detailData.lSettleBal }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>本批结算日期</p>
                <p style={detailText}>{ detailData.lSettleDate }</p>
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
              <div>
                <p style={detailTitle}>本次划拨金额</p>
                <p style={detailText}>{ detailData.remitMoney }</p>
              </div>
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
              <div>
                <p style={detailTitle}>划拨时间</p>
                <p style={detailText}>{ detailData.lSettleDate }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>开票状态</p>
                <p style={detailText}>{ getObjStatus(ticketFlagList, detailData.ticketFlag) }</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>备注</p>
                <p style={detailText}>{ detailData.dataReserve }</p>
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