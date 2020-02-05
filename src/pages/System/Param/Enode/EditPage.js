import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col } from "antd";
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
import RegionSelect from '@/components/TKRegionSelect';
import LangSelect from '@/components/TKLangSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import StatusSelect from '@/components/MsStatusSelect';

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

const namespace = 'node';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        nodeId,
        nodeRole,
        nodeNameInput,
        instMapId,
        nodeRegionId,
        nodeIp,
        nodePort,
        nodeFileIp,
        nodeKey,
        nodeLangDef,
        nodeCountryDef,
        dodePartnerFlag,
        nodeMerchantFlag,
        nodePartnerFlag,
        masterIp,
        masterPort,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        nodeId,
        nodeRole,
        nodeName: nodeNameInput,
        instMapId,
        nodeRegionId,
        nodeRegionDef: nodeRegionId,
        nodeIp,
        nodePort,
        nodeFileIp,
        nodeKey,
        nodeLangDef,
        nodeCountryDef,
        dodePartnerFlag,
        nodeMerchantFlag,
        nodePartnerFlag,
        masterIp,
        masterPort,
        dataReserve,
      };

      dispatch({
        type: detailData ? `${namespace}/update` : `${namespace}/add`,
        payload: values,
        callback: (res) => {
          if (res) {
            if (res.code == '00') {
              responseMsg(res)
              onReturnList()
            }else{
              responseMsg(res)
            }
          }
        }
      });
    });
  };

  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='节点ID'>
                {getFieldDecorator('nodeId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeId : ''}))
                (
                  <Input placeholder='请输入节点ID' maxLength={8}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='节点名称'>
                {getFieldDecorator('nodeNameInput', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeName : ''}))
                (
                  <Input placeholder='请输入节点名称' maxLength={16}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='使用机构'>
                {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
                (
                  <InstitudeSelect placeholder='请选择归属机构'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='渠道级别'>
                {getFieldDecorator('nodePartnerFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodePartnerFlag : 2}))
                (
                  <StatusSelect options={partnerLvSelect} placeholder='请选择渠道级别'/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='商户级别'>
                {getFieldDecorator('nodeMerchantFlag', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeMerchantFlag : 2}))
                (
                  <StatusSelect options={merLvSelect} placeholder='请选择商户级别'/>
                )}
              </FormItem>
            </Col>
            {/* <Col span={16}>
              <FormItem>
                {getFieldDecorator('checkbox-group', Object.assign({}, {initialValue: detailData ? detailData.instMapId : ['a', 'b']}))
                (
                  <Checkbox.Group style={{ width: '100%', position: 'relative', top: '34px'}}>
                      <Checkbox value="a">两级渠道</Checkbox>
                      <Checkbox value="b">两级商户</Checkbox>
                  </Checkbox.Group>
                )}
              </FormItem>
            </Col> */}
          </Row>

          <hr style={{ height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc' }}/>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='节点IP'>
                {getFieldDecorator('nodeIp', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeIp : ''}))
                (
                  <Input placeholder='请输入节点IP' maxLength={16}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='节点端口'>
                {getFieldDecorator('nodePort', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodePort : ''}))
                (
                  <Input placeholder='请输入节点端口' maxLength={8}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='文件服务器IP'>
                {getFieldDecorator('nodeFileIp', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeFileIp : ''}))
                (
                  <Input placeholder='请输入IP' maxLength={16}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='部署国家/地区'>
                {getFieldDecorator('nodeRegionId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeRegionId : 156}))
                (
                  <RegionSelect placeholder='请选择国家/地区' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='缺省语言'>
                {getFieldDecorator('nodeLangDef', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeLangDef : 'zh_CN'}))
                (<LangSelect placeholder='请选择语言' />)}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label='节点位置'>
                {getFieldDecorator('nodeRole', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeRole : 'M'}))
                (
                  <StatusSelect options={nodeRoleSelect} placeholder='请选择节点位置'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='同步总控IP'>
                {getFieldDecorator('masterIp', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.masterIp : ''}))
                (
                  <Input placeholder='请输入总控IP' maxLength={16}/>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='同步总控端口' maxLength={8}>
                {getFieldDecorator('masterPort', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.masterPort : ''}))
                (
                  <Input placeholder='请输入总控端口' maxLength={8}/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='同步密钥'>
                {getFieldDecorator('nodeKey', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.nodeKey : ''}))
                (
                  <Input placeholder='请输入同步密钥' maxLength={32}/>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='备注'>
                {getFieldDecorator('dataReserve', Object.assign({}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (
                  <TextArea rows={4} placeholder="请输入备注" maxLength={100}/>
                )}
              </FormItem>
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
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage