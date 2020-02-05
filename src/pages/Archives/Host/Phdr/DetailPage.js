import { Component } from 'react';
import { Row, Col, Form, Button, Divider, Timeline } from 'antd';
import styles from './styles.less';
import { covertMoney2Yuan } from '@/utils/utils';
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
                <p style={detailTitle}>归属机构</p>
                <p style={detailText}>{detailData.instName}</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>归属通道</p>
                <p style={detailText}>{detailData.hostName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>通道分配渠道号</p>
                <p style={detailText}>{detailData.instHostCode}</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>结算币种</p>
                <p style={detailText}>{detailData.coinName}</p>
              </div>
            </Col>
          </Row>

          <Divider />

          <Timeline>
            <Timeline.Item key={detailData.paytypeId}>
                <p>{detailData.paytypeName}</p>
                <Row gutter={16}>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>成本扣率</p>
                            <p style={detailText}>{detailData.mdrPerFee} %</p>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>封顶</p>
                            <p style={detailText}>{covertMoney2Yuan(detailData.mdrFixFee)}</p>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>发卡方扣率</p>
                            <p style={detailText}>{detailData.issPerFee} %</p>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>封顶</p>
                            <p style={detailText}>{covertMoney2Yuan(detailData.issFixFee)}</p>
                        </div>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>网络方扣率</p>
                            <p style={detailText}>{detailData.netPerFee} %</p>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>封顶</p>
                            <p style={detailText}>{covertMoney2Yuan(detailData.netFixFee)}</p>
                        </div>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <div>
                            <p style={detailTitle}>品牌方扣率</p>
                            <p style={detailText}>{detailData.brandPerFee} %</p>
                        </div>
                    </Col>
                    <Col span={12}>                        
                        <div>
                            <p style={detailTitle}>封顶</p>
                            <p style={detailText}>{covertMoney2Yuan(detailData.brandFixFee)}</p>
                        </div>
                    </Col>
                </Row>
            </Timeline.Item>
          </Timeline>

          <Divider />

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>添加日期</p>
                <p style={detailText}>{detailData.timeCreate}</p>
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