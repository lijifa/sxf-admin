import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import styles from './styles.less';
import {getObjStatus} from '@/utils/utils';

const blackFlagSelect = [
  {key: 0, value: '白名单'},
  {key: 1, value: '黑名单'},
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
                <p style={detailTitle}>商户编号</p>
                <p style={detailText}>{detailData.merNo}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户名称</p>
                <p style={detailText}>{detailData.merName}</p>
              </div>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>黑白名单</p>
                <p style={detailText}>{detailData.blackFlag_str}</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>备注</p>
                <p style={detailText}>{detailData.dataReserve ? detailData.dataReserve : '-'}</p>
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