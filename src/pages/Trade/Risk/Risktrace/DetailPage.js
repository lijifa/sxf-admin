import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import styles from './styles.less';

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
            <Col span={24}>
              <div>
                <p style={detailTitle}>商户名称</p>
                <p style={detailText}>{detailData.transMerName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>交易金额</p>
                <p style={detailText}>{detailData.amtTrans}</p>
              </div>
            </Col>

            <Col span={8}>
              <div>
                <p style={detailTitle}>支付方式</p>
                <p style={detailText}>{detailData.paytypeName}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>交易类型</p>
                <p style={detailText}>{detailData.transSubname}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>商户端号</p>
                <p style={detailText}>{detailData.transPosTrace}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>卡号/帐号</p>
                <p style={detailText}>{detailData.panNo}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>风控处理</p>
                <p style={detailText}>{detailData.transRiskFlag_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>风控规则</p>
                <p style={detailText}>{ detailData.ruleName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>交易时间（系统时间）</p>
                <p style={detailText}>{detailData.date + ' ('  + detailData.timeCreate + ')'}</p>
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