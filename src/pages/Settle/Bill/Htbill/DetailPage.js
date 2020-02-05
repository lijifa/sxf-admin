import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import { getObjStatus } from '@/utils/utils';
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
                <p style={detailTitle}>机构名称</p>
                <p style={detailText}>{detailData.instName}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>通道编号</p>
                <p style={detailText}>{ detailData.hostMapId}</p>
              </div>
            </Col>
            <Col span={8} offset={8}>
              <div>
                <p style={detailTitle}>通道名称</p>
                <p style={detailText}>{detailData.hostName}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>交易笔数/金额</p>
                <p style={detailText}>{detailData.ptTransCnt + '/' + detailData.ptTransAmt_str}</p>
              </div>
            </Col>
            <Col span={8} offset={8}>
              <div>
                <p style={detailTitle}>交易时间</p>
                <p style={detailText}>{detailData.timeCreate}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>商户结算余额</p>
                <p style={detailText}>{detailData.ptAmtMerSettle_str}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>商户总手续费</p>
                <p style={detailText}>{detailData.ptAmtMerMdr_str}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>清算模式</p>
                <p style={detailText}>{detailData.settleType_str}</p>
              </div>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>总结算金额</p>
                <p style={detailText}>{detailData.settleAmt_str}</p>
              </div>
            </Col>
            <Col span={8} offset={8}>
              <div>
                <p style={detailTitle}>通道成本手续费金额</p>
                <p style={detailText}>{detailData.ptMdrHostFee_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>结算日期</p>
                <p style={detailText}>{detailData.settleDate}</p>
              </div>
            </Col>
            <Col span={8} offset={8}>
              <div>
                <p style={detailTitle}>发卡方手续费金额</p>
                <p style={detailText}>{detailData.ptFeeIss_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8} offset={16}>
              <div>
                <p style={detailTitle}>品牌方手续费金额</p>
                <p style={detailText}>{detailData.ptFeeBrand_str}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8} offset={16}>
              <div>
                <p style={detailTitle}>交换方手续费金额</p>
                <p style={detailText}>{detailData.ptFeeNet_str}</p>
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