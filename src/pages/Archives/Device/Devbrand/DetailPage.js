import { Component } from 'react';
import { Row, Col, Form, Button, Divider } from 'antd';
import styles from './styles.less';

export default class DetailPage extends Component {
  
  constructor (props) {
    super(props)
  }

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
                <p style={detailTitle}>品牌名称</p>
                <p style={detailText}>{detailData.devbrandName}</p>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>联系人</p>
                <p style={detailText}>{detailData.commName}</p>
              </div>
            </Col>

            <Col span={12}>
              <div>
                <p style={detailTitle}>联系手机</p>
                <p style={detailText}>{detailData.commMobile}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>联系电话</p>
                <p style={detailText}>{detailData.commTel}</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>联系传真</p>
                <p style={detailText}>{detailData.commFax}</p>
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
            <Col span={12}>
              <div>
                <p style={detailTitle}>邮政编码</p>
                <p style={detailText}>{detailData.commCityZipId}</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>Email</p>
                <p style={detailText}>{detailData.commEmail}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>状态</p>
                <p style={detailText}>{ detailData.devbrandStatusText}</p>
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