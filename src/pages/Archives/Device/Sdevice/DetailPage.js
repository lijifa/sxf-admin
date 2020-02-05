import { Component } from "react";
import { Form, Row, Col } from 'antd';
import { getOrgStr } from '@/utils/utils';
const FormItem = Form.Item;

export default class DetailPage extends Component {

    // getOrgName = (data) => {
    //     let nameStr = ' - '
    //     if (data.instName) {
    //         nameStr = data.instName
    //     }

    //     if (data.partnerName) {
    //         nameStr = data.instName + ' - ' + data.partnerName
    //     }

    //     if (data.partnerNameP) {
    //         nameStr = data.instName + ' - ' + data.partnerName + ' - ' + data.partnerNameP
    //     }
    //     return nameStr
    // }

    render(){
        const {detailData} = this.props
        return(
          <div className='detailFormItem'>
              <Form layout='vertical' onSubmit={this.handleSubmit}>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='品牌'>
                              {detailData.devbrandName}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='型号'>
                              {detailData.modelCode}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='设备序列号'>
                              {detailData.deviceSn}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='归属'>
                              { getOrgStr(detailData) }
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='隶属标识'>
                              {detailData.deviceAttachText}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={24}>
                          <FormItem className='singleFormItem' label='状态'>
                              {detailData.deviceStatusText}
                          </FormItem>
                      </Col>
                  </Row>

                  <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

                  <FormItem className='singleFormItem' label='创建时间'>
                      {detailData.timeCreate}
                  </FormItem>

                  <FormItem className='singleFormItem' label='更新时间'>
                      {detailData.timeUpdate}
                  </FormItem>

              </Form>
          </div>
        )
    }
}