import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Divider } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
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
    const { img1, img2, img3, img4, img5, img6, img7, img8 } = this.state;
    const { detailData } = this.props;
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }

    const certStyle = {
      textAlign:'center',
      border: '1px solid #ccc',
      marginBottom: '10px'
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
                <p style={detailTitle}>纳税人识别号</p>
                <p style={detailText}>{detailData ? detailData.certTaxNo : ' - '}</p>
              </div>
            </Col>
            <Col span={16}>
              <div>
                <p style={detailTitle}>营业执照名称</p>
                <p style={detailText}>{detailData ? detailData.certName : ' - '}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>法人姓名</p>
                <p style={detailText}>{detailData ? detailData.certLpName : ' - '}</p>
              </div>
            </Col>
            <Col span={16}>
              <div>
                <p style={detailTitle}>法人身份证号码</p>
                <p style={detailText}>{detailData ? detailData.certLpId : ' - '}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>注册地址</p>
                <p style={detailText}>{detailData ? detailData.certAddress : ' - '}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>营业执照照片</p>
              <div style={certStyle}>
                <img src={img1} style={{width:'120px'}}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>法人证件正面照</p>
              <div style={certStyle}>
                <img src={img2} style={{width:'120px'}}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>法人证件背面照</p>
              <div style={certStyle}>
                <img src={img3} style={{width:'120px'}}/>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>门店抬头照片</p>
              <div style={certStyle}>
                <img src={img4} style={{width:'120px'}}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>门店内部场景照</p>
              <div style={certStyle}>
                <img src={img5} style={{width:'120px'}}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>门店产品照</p>
              <div style={certStyle}>
                <img src={img6} style={{width:'120px'}}/>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <p style={certTitleStyle}>门店收银台照</p>
              <div style={certStyle}>
                <img src={img7} style={{width:'120px'}}/>
              </div>
            </Col>
            <Col span={8}>
              <p style={certTitleStyle}>渠道协议合同照</p>
              <div style={certStyle}>
                <img src={img8} style={{width:'120px'}}/>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditCertPage);
export default EditFormPage