import { Component } from "react";
import { Form, Row, Col } from 'antd';
import {getOrgStr} from '@/utils/utils';
const FormItem = Form.Item;

export default class DetailPage extends Component {
    render() {
        const { detailData } = this.props
        return (
            <div className='detailFormItem'>
                <Form layout='vertical' onSubmit={this.handleSubmit}>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='归属机构'>
                                { getOrgStr(detailData) }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='品牌 / 型号'>
                                {detailData.devbrandMapId}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='设备序列号'>
                                {detailData.deviceSn}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='安装商户'>
                                {detailData.merMapId}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='POS编号'>
                                {detailData.posNo}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='安装门店'>
                                {detailData.shopMapId}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='款台号'>
                                {detailData.casherNo}
                            </FormItem>
                        </Col>

                    </Row>
                    <Row gutter={16}>

                        <Col span={16}>
                            <FormItem className='singleFormItem' label='安装临时秘钥'>
                                {detailData.deviceToken}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='状态'>
                                {detailData.deviceStatusText}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={16}>
                            <FormItem className='singleFormItem' label='安装时间'>
                                {detailData.timeCreate}
                            </FormItem>
                        </Col>
                    </Row>

                    <hr style={{ height: '1px', marginBottom: '7px', border: 'none', borderTop: '1px dashed #ccc' }} />

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