import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import styles from './styles.less';
import {getObjStatus} from '@/utils/utils';

const merGradeSelect = [
  {key: 0, value: '无'},
  {key: 1, value: '优'},
  {key: 2, value: '良'},
  {key: 3, value: '合格'},
  {key: 4, value: '可疑'},
  {key: 5, value: '风险'},
]
const riskUptSelect = [
  {key: 0, value: '当天'},
  {key: 1, value: '一天'},
  {key: 7, value: '七天'},
  {key: 30, value: '三十天'},
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
            <Col span={24}>
              <div>
                <p style={detailTitle}>机构</p>
                <p style={detailText}>{detailData.instName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>适用MCC</p>
                <p style={detailText}>{detailData.mccName_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>适用商户</p>
                <p style={detailText}>{detailData.merGrade_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>评级周期</p>
                <p style={detailText}>{detailData.riskUpt_str}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>调用积数</p>
                <p style={detailText}>{detailData.riskrunBound}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>状态</p>
                <p style={detailText}>{ detailData.riskrunStatus_str}</p>
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