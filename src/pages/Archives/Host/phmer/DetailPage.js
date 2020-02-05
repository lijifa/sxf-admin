import { Component } from 'react';
import { Row, Col, Form, Button, Divider, Timeline } from 'antd';
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
                <p style={detailTitle}>平台商户编号</p>
                <p style={detailText}>{detailData.merNo}</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户名称</p>
                <p style={detailText}>{ detailData.merName }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户英文名称</p>
                <p style={detailText}>{ detailData.merNameEn }</p>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>通道名称</p>
                <p style={detailText}>{detailData.hostName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>报备商户编号</p>
                <p style={detailText}>{detailData.hostMerNo}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>报备商户名称</p>
                <p style={detailText}>{detailData.hostMerName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>报备商户地址</p>
                <p style={detailText}>{detailData.hostMerAddress}</p>
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