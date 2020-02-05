import { Component, Fragment } from "react";
import { Row, Col, Table, Form, Divider } from "antd";
import styles from './styles.less';

const FormItem = Form.Item;


export default class DetailPage extends Component {

    render(){
        const {detailData} = this.props
        return(
          <Fragment>
              <div style={{ width: '100%'}}>
                  <div className='detailFormItem'>
                      <Form layout='vertical' onSubmit={this.handleSubmit}>
                          <Row gutter={16}>
                              <Col span={16}>
                                  <FormItem className='singleFormItem' label='商户名称'>
                                      {detailData.transMerName}
                                  </FormItem>
                              </Col>
                          </Row>
                      </Form>
                  </div>
                  <div style={{ float: 'left', width: '60%', borderRight:' 1px dashed #ccc'}} className='detailFormItem'>
                      <Form layout='vertical' onSubmit={this.handleSubmit}>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='交易金额'>
                                      {detailData.amtTrans}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='商户结算金额'>
                                      {detailData.amtMer}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='交易手续费'>
                                      {detailData.amtMerMdr}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='支付方式'>
                                      {detailData.paytypeName}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='交易类型'>
                                      {detailData.transName}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='处理结果/状态'>
                                      {detailData.transStatus + '/' + detailData.status}
                                  </FormItem>
                              </Col>
                          </Row>

                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='商户编号'>
                                      {detailData.transMerNo}
                                  </FormItem>
                              </Col>
                              <Col span={16}>
                                  <FormItem className='singleFormItem' label='帐号卡号'>
                                      {detailData.panNo}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='终端编号'>
                                      {detailData.transPosNo}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='批次号'>
                                      {detailData.transPosBatch}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='流水号'>
                                      {detailData.transPosTrace}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道'>
                                      {detailData.hostName}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道商户编号'>
                                      {detailData.hostMerNo}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道终端编号'>
                                      {detailData.hostPosNo}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道参考号'>
                                      {detailData.traceMesgOrg}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道终端批次号'>
                                      {detailData.hostPosBatch}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='通道终端流水号'>
                                      {detailData.hostPosTrace}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='卡类型'>
                                      {detailData.panCardtype}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='发卡方'>
                                      {detailData.panBankName}
                                  </FormItem>
                              </Col>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='授权号'>
                                      {detailData.hostAuth}
                                  </FormItem>
                              </Col>
                          </Row>

                          <Row gutter={16}>
                              <Col span={8}>
                                  <FormItem className='singleFormItem' label='风控'>
                                      {detailData.transRiskFlag}
                                  </FormItem>
                              </Col>
                              <Col span={16}>
                                  <FormItem className='singleFormItem' label='处理方式'>
                                      {detailData.transType}
                                  </FormItem>
                              </Col>
                          </Row>

                          <Row gutter={16}>
                              <Col span={16}>
                                  <FormItem className='singleFormItem' label='交易时间（系统时间）'>
                                      {detailData.timeCreate}
                                  </FormItem>
                              </Col>
                          </Row>

                      </Form>
                  </div>
                  <div style={{ float: 'right', width: '40%', position: 'relative', left: '10px'}} className='detailFormItem'>
                      <Form layout='vertical' onSubmit={this.handleSubmit}>
                          <Row gutter={16}>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='通道清算日期'>
                                      {detailData.settleDatePlat}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='通道成本手续费'>
                                      {detailData.amtMdrHostFee}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={12} offset={12}>
                                  <FormItem className='singleFormItem' label='交换方手续费'>
                                      {detailData.amtFeeNet}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={12} offset={12}>
                                  <FormItem className='singleFormItem' label='发卡方手续费'>
                                      {detailData.amtFeeIss}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={12} offset={12}>
                                  <FormItem className='singleFormItem' label='品牌方手续费'>
                                      {detailData.amtFeeBrand}
                                  </FormItem>
                              </Col>
                          </Row>

                          <Row gutter={16}>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='渠道清算日期'>
                                      {detailData.settleDatePartner}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='渠道分润'>
                                      {detailData.amtFeePartner}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={12} offset={12}>
                                  <FormItem className='singleFormItem' label='渠道成本手续费'>
                                      {detailData.amtMdrPlatFee}
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row gutter={16}>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='机构清算日期'>
                                      {detailData.settleDateInst}
                                  </FormItem>
                              </Col>
                              <Col span={12}>
                                  <FormItem className='singleFormItem' label='机构手续费分润'>
                                      {detailData.amtFeeInst}
                                  </FormItem>
                              </Col>
                          </Row>

                      </Form>
                  </div>
              </div>
          </Fragment>
        )
    }
}