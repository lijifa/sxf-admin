import { Component } from "react";
import styles from './styles.less';
import { Form, Row, Col } from 'antd';
const FormItem = Form.Item;
export default class DetailPage extends Component {
    render(){
        const {detailData} = this.props
        return(
          <div className='detailFormItem'>
              <Form layout='vertical' onSubmit={this.handleSubmit}>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='品牌'>
                              {detailData.devbrandName}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='型号分类'>
                              {detailData.modelTypeText}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='型号代码'>
                              {detailData.modelCode}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='打印机'>
                              {detailData.modelPrinterText}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='密码键盘'>
                              {detailData.modelPinpadText}
                          </FormItem>
                      </Col>
                  </Row>
                  <Row gutter={16}>
                      <Col span={16}>
                          <FormItem className='singleFormItem' label='启用状态'>
                              {detailData.modelStatusText}
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