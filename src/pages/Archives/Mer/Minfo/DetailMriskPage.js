import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Divider } from 'antd';
import {responseMsg, covertMoney2Yuan} from '@/utils/utils';
import styles from './styles.less';
const certPhoto = 'http://m.xingdata.com:8080/tkcimg/img_1.png';
const lpPhoto1 = 'http://m.xingdata.com:8080/tkcimg/img_2.png';
const lpPhoto2 = 'http://m.xingdata.com:8080/tkcimg/img_3.png';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const namespace = 'bank';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditCertPage extends Component {

  constructor (props) {
    super(props)
  }

  state = {
    img1: certPhoto,
    img2: lpPhoto1,
    img3: lpPhoto2,
    img4: imgDemo,
    img5: imgDemo,
    img6: imgDemo,
    img7: imgDemo,
    img8: imgDemo,
  }

  // componentDidMount() {
  //   const { detailData } = this.props;
  //   this.setState({
  //     img1: detailData ? detailData.certPhoto : certPhoto,
  //     img2: detailData ? detailData.certLpPhoto1 : lpPhoto1,
  //     img3: detailData ? detailData.certLpPhoto2 : lpPhoto2,
  //     img4: detailData ? detailData.certAddrPhoto1 : imgDemo,
  //     img5: detailData ? detailData.certAddrPhoto2 : imgDemo,
  //     img6: detailData ? detailData.certAddrPhoto3 : imgDemo,
  //     img7: detailData ? detailData.certAddrPhoto4 : imgDemo,
  //     img8: detailData ? detailData.certAddrPhoto5 : imgDemo,
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 0 ) {
      this.setState({
        img1: detailData ? detailData.certPhoto : certPhoto,
        img2: detailData ? detailData.certLpPhoto1 : lpPhoto1,
        img3: detailData ? detailData.certLpPhoto2 : lpPhoto2,
        img4: detailData ? detailData.certAddrPhoto1 : imgDemo,
        img5: detailData ? detailData.certAddrPhoto2 : imgDemo,
        img6: detailData ? detailData.certAddrPhoto3 : imgDemo,
        img7: detailData ? detailData.certAddrPhoto4 : imgDemo,
        img8: detailData ? detailData.certAddrPhoto5 : imgDemo,
      })
    }
  }

  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(0, 'back')
  };

  handleSubmit = () => {
    const { clickNext } = this.props;
    clickNext(1)
  };

  render() {
    const { detailData } = this.props;
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }

    const certStyle = {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '16px'
    }
    const certTitleStyle = {
      marginBottom: '4px'
    }
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' style={{padding: '0 20px', marginBottom: '28px'}}>
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>日均限额</p>
                <p style={detailText}>{detailData ? covertMoney2Yuan(detailData.maxDayAmt) : 0}</p>
              </div>
            </Col>
            <Col span={16}>
              <div>
                <p style={detailTitle}>单笔限额</p>
                <p style={detailText}>{detailData ? covertMoney2Yuan(detailData.maxPerAmt) : 0}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>交易开通</p>
                <p style={detailText}>{detailData ? detailData.openPaytrans : '-'}</p>
              </div>
            </Col>
            <Col span={16}>
              <div>
                <p style={detailTitle}>支付开通</p>
                <p style={detailText}>{detailData ? detailData.openPaytype : '-'}</p>
              </div>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>风险评级</p>
              <div style={certStyle}>
                普通商户
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>风险积数</p>
              <div style={certStyle}>
                0
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>手输比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>退货比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>调单比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>非营业时间比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>失败比例</p>
              <div style={certStyle}>
                0%
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>退单比例</p>
              <div style={certStyle}>
                0%
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
            <Button style={{
                marginRight: 8,
              }} type="primary" onClick={this.onBackup}>上一步</Button>
            <Button type="primary" onClick={this.handleSubmit}>下一步</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditCertPage);
export default EditFormPage