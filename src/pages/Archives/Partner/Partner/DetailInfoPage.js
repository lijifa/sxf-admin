import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button } from 'antd';
import {responseMsg, changeTime, getObjStatus} from '@/utils/utils';
import styles from './styles.less';
const imgDemo = 'http://m.xingdata.com:8080/tkcimg/img_4.png';
const FormItem = Form.Item;
const partnerLvSelect = [
  {key: 1, value: '一级渠道'},
  {key: 2, value: '二级渠道'}
]
const namespace = 'bank';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditInfoPage extends Component {
  
  constructor (props) {
    super(props)
  }

  state = {
    commRegionId: '156',
    commCityId: '',
    commCityCountyName: '',
    commCityName: '',
    commCityProvName: '',
    commCityZip: '',
    customLogo: imgDemo
  }

  componentWillReceiveProps(nextProps) {
    const { detailData, nextFlag } = nextProps;
    if ( detailData && nextFlag == 0 ) {
      this.setState({
        commRegionId: detailData ? detailData.commRegionId : '156',
        commCityId: detailData ? detailData.commCityId : '',
        commCityCountyName: detailData ? detailData.commCityCountyName : '',
        commCityName: detailData ? detailData.commCityName : '',
        commCityProvName: detailData ? detailData.commCityProvName : '',
        commCityZip: detailData ? detailData.commCityZip : '',
        customLogo: detailData ? detailData.customLogo : imgDemo
      })
    }
  }
  
  handleSubmit = () => {
    this.props.clickNext(0)
  };

  getCityStr = (partner, flag='str') => {
    let cityStr = '-'
    //判断以何种方式返回城市信息【字符串，数组】
    if (flag == 'str') {
      if (partner.commCityProvName) {
        cityStr = partner.commCityProvName
      }
      if (partner.commCityName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityCountyName
      }
      if (partner.commCityName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityCountyName + ' - ' + partner.commCityName
      }
    }

    if (flag == 'array') {
      if (partner.commCityProvName) {
        cityStr = [partner.commCityProvName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityCountyName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityCountyName, partner.commCityName]
      }
    }
    return cityStr
  }

  render() {
    const { customLogo } = this.state;
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
            <Col span={16}>
              <div>
                <p style={detailTitle}>归属机构</p>
                <p style={detailText}>{detailData.instMapId}</p>
              </div>
              <div>
                <p style={detailTitle}>级别</p>
                <p style={detailText}>{getObjStatus(partnerLvSelect, detailData.partnerLevel)}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <img src={customLogo} style={{width:'120px', border: '1px solid #ccc', borderRadius: '5px'}}/>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>上级渠道</p>
                <p style={detailText}>{detailData.partnerName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>联系人</p>
                <p style={detailText}>{detailData.commMan}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div>
                <p style={detailTitle}>详细地址</p>
                <p style={detailText}>{this.getCityStr(detailData)} {detailData.commAddress}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>邮政编码</p>
                <p style={detailText}>{detailData.commCityZip}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>Email</p>
                <p style={detailText}>{detailData.commEmail}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={8}>
              <div>
                <p style={detailTitle}>手机号</p>
                <p style={detailText}>{detailData.commMobile}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>电话号码</p>
                <p style={detailText}>{detailData.commTel}</p>
              </div>
            </Col>
            <Col span={8}>
              <div>
                <p style={detailTitle}>传真号码</p>
                <p style={detailText}>{detailData.commFax}</p>
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
            <Button type="primary" onClick={(e)=>this.handleSubmit(e)}>下一步</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditInfoPage);
export default EditFormPage