import { Component } from 'react';
import { Row, Col, Form, Button, Divider, Timeline } from 'antd';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import styles from './styles.less';

const settleTypeList =  [
    {key: '0', value: '代理模式'},
    {key: '1', value: '收单模式(二清)'}
]

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
        cityStr = partner.commCityProvName + ' - ' + partner.commCityName
      }
      if (partner.commCityName) {
        cityStr = partner.commCityProvName + ' - ' + partner.commCityName + ' - ' + partner.commCityCountyName
      }
    }

    if (flag == 'array') {
      if (partner.commCityProvName) {
        cityStr = [partner.commCityProvName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityName]
      }
      if (partner.commCityName) {
        cityStr = [partner.commCityProvName, partner.commCityName, partner.commCityCountyName]
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
                    <Col span={12}>
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
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>通道分配渠道号</p>
                                <p style={detailText}>{detailData.instHostCode}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>清算模式</p>
                                <p style={detailText}>{getObjStatus(settleTypeList, detailData.settleType)}</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>结算币种</p>
                                <p style={detailText}>{detailData.coinName}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>合同编号</p>
                                <p style={detailText}>{detailData.contractNo}</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>合同到期</p>
                                <p style={detailText}>{formatTime(detailData.contractExp)}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>联系人</p>
                                <p style={detailText}>{detailData.commMan}</p>
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
                                <p style={detailTitle}>所在城市</p>
                                <p style={detailText}>{this.getCityStr(detailData)}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <p style={detailTitle}>详细地址</p>
                                <p style={detailText}>{detailData.commAddress}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>邮政编码</p>
                                <p style={detailText}>{detailData.commCityZip}</p>
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
                                <p style={detailTitle}>电话号码</p>
                                <p style={detailText}>{detailData.commTel}</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>传真号码</p>
                                <p style={detailText}>{detailData.commFax}</p>
                            </div>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <p style={detailTitle}>企业名称</p>
                                <p style={detailText}>{detailData.certName}</p>
                            </div>
                        </Col>
                    </Row>
                    
                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <p style={detailTitle}>企业注册地址</p>
                                <p style={detailText}>{detailData.certAddress}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>纳税人识别号</p>
                                <p style={detailText}>{detailData.certTaxNo}</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>法人姓名</p>
                                <p style={detailText}>{detailData.certLpName}</p>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <p style={detailTitle}>法人身份证号</p>
                                <p style={detailText}>{detailData.certLpId}</p>
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