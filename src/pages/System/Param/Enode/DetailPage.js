import { Component } from "react";
import { Col, Form, Row } from "antd";
import { getObjStatus } from '@/utils/utils';
const FormItem = Form.Item;

const partnerLvSelect = [
    {key: 0, value: '无'},
    {key: 1, value: '一级'},
    {key: 2, value: '两级'}
]
const merLvSelect = [
    {key: 1, value: '一级商户'},
    {key: 2, value: '两级商户'}
]
const nodeRoleSelect = [
    {key: 'M', value: '总控MASTER'},
    {key: 'S', value: '节点SLAVE'}
]
export default class DetailPage extends Component {

    render(){
       const {detailData} = this.props
        return(
          <div className='detailFormItem'>
              <Form layout='vertical' onSubmit={this.handleSubmit}>
                  <Row gutter={16}>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='节点ID'>
                              {detailData.nodeId}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem  className='singleFormItem' label='节点名称'>
                              {detailData.nodeName}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='使用机构'>
                              {detailData.instName}
                          </FormItem>
                      </Col>
                      
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='渠道级别'>
                              {getObjStatus(partnerLvSelect, detailData.nodePartnerFlag)}
                          </FormItem>
                      </Col>


                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='商户级别'>
                              {getObjStatus(merLvSelect, detailData.nodeMerchantFlag)}
                          </FormItem>
                      </Col>
                  </Row>

                  <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

                  <Row gutter={16}>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='节点IP'>
                              {detailData.nodeIp}
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='节点端口'>
                              {detailData.nodePort}
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='文件服务器IP'>
                              {detailData.nodeFileIp}
                          </FormItem>
                      </Col>
                  </Row>

                  <Row gutter={16}>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='部署国家/地区'>
                              {detailData.nodeRegionId}
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='缺省语言'>
                              {detailData.nodeLangDef}
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='节点位置'>
                              {getObjStatus(nodeRoleSelect, detailData.nodeRole)}
                          </FormItem>
                      </Col>
                  </Row>

                  <Row gutter={16}>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='同步总控IP'>
                              {detailData.masterIp}
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem  className='singleFormItem' label='同步总控端口'>
                              {detailData.masterPort}
                          </FormItem>
                      </Col>
                  </Row>

                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem  className='singleFormItem' label='同步密钥'>
                              {detailData.nodeKey}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem  className='singleFormItem' label='备注'>
                              {detailData.dataReserve}
                          </FormItem>
                      </Col>
                  </Row>

              </Form>
          </div>
        )
    }
}