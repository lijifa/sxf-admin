import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, message } from "antd";
import {responseMsg, changeTime, getOrgData} from '@/utils/utils';
import DevTypeSelect from '@/components/TKDevTypeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import StatusSelect from '@/components/MsStatusSelect';
import styles from './styles.less';
import { array } from 'prop-types';
const FormItem = Form.Item;
const deviceAttachSelect = [
  {key: 0, value: '自有'},
  {key: 1, value: '携机入网'}
]
const deviceStatusSelect = [
  {key: 2, value: '库存状态'},
  {key: 4, value: '报修状态'},
  {key: 5, value: '报废状态'},
  {key: 9, value: '注销状态'}
]
const namespace = 'sdevice';

@connect(({ sdevice }) => ({
  result: sdevice.editRes,
}))
class EditPage extends Component {
  state = {
    devbrandMapId: '',
    modelCode: '',
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
  }

  //获取组织数据
  onChangeOrg = (data) => {
    let odata = ''
    odata = getOrgData(data, '0')
    this.setState({
      instMapId: odata.instMapId,
      partnerMapId: odata.partnerMapId,
      partnerMapIdP: odata.partnerMapIdP
    })
  }

  //获取品牌数据
  onChangeDevType = (data) => {
    if (data[0]) {
      this.setState({
        devbrandMapId: data[0].id
      })
    }
    if (data[1]) {
      this.setState({
        modelCode: data[1].id
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { devbrandMapId, modelCode, instMapId, partnerMapId, partnerMapIdP } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        deviceSn,
        deviceStatus,
        deviceAttach
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        deviceSnList: [deviceSn],
        devbrandMapId,
        modelCode,
        deviceStatus: deviceStatus ? deviceStatus : 2,
        deviceAttach,
        instMapId,
        partnerMapIdP,
        partnerMapId,
        devBatchId: 0
      };

      if (!devbrandMapId || !modelCode) {
        message.error('请完善品牌、型号内容')
        return
      }
      
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

  getOrgStr = (data, flag='str') => {
    let orgStr = ''
    //判断以何种方式返回城市信息【字符串，数组】
    if (flag == 'str') {
      if (data.instName) {
        orgStr = data.instName
      }
      if (data.partnerName) {
        orgStr = data.instName + ' - ' + data.partnerName
      }
      if (data.partnerNameP) {
        orgStr = data.instName + ' - ' + data.partnerName + ' - ' + data.partnerNameP
      }
    }

    if (flag == 'array') {
      if (data.instName) {
        orgStr = [data.instName]
      }
      if (data.partnerName) {
        orgStr = [data.instName, data.partnerName]
      }
      if (data.partnerNameP) {
        orgStr = [data.instName, data.partnerName, data.partnerNameP]
      }
    }
    return orgStr
  }

  getDevStr = (data, flag='str') => {
    let DevStr = '-'
    //判断以何种方式返回城市信息【字符串，数组】
    if (flag == 'str') {
      if (data.devbrandName) {
        DevStr = data.devbrandName
      }
      if (data.modelCode) {
        DevStr = data.devbrandName + ' - ' + data.modelCode
      }
    }

    if (flag == 'array') {
      if (data.devbrandName) {
        DevStr = [data.devbrandName]
      }
      if (data.modelCode) {
        DevStr = [data.devbrandName, data.modelCode]
      }
    }
    return DevStr
  }
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
            <Col span={16}>
              <FormItem label='品牌/型号'>
                {getFieldDecorator('devData', Object.assign({}, decoratorConfig, {initialValue: detailData ? this.getDevStr(detailData, 'array') : []}))
                (
                  <DevTypeSelect
                    allData={true}
                    placeholder='请选择品牌/型号'
                    onChange={(val)=>this.onChangeDevType(val)}
                    editValue={detailData ? this.getDevStr(detailData, 'array') : ''}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='设备序列号'>
                {getFieldDecorator('deviceSn', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.deviceSn : ''}))
                (
                  <Input placeholder='请输入设备序列号'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <hr style={{ height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc' }}/>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='归属'>
                {getFieldDecorator('orgData', Object.assign({}, decoratorConfig, {initialValue: detailData ? this.getOrgStr(detailData, 'array') : []}))
                (
                  <OrgSelect
                    allData={true}
                    placeholder='请选择归属机构'
                    onChange={(val) => this.onChangeOrg(val)}
                    editValue={detailData ? this.getOrgStr(detailData, 'array') : ''}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='隶属标识'>
                {getFieldDecorator('deviceAttach', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.deviceAttach : 0}))
                (
                  <StatusSelect options={deviceAttachSelect} placeholder='隶属标识'/>
                )}
              </FormItem>
            </Col>
          </Row>
          {
            detailData ?
              <Row gutter={16}>
                <Col span={16}>
                  <FormItem label='状态'>
                    {getFieldDecorator('deviceStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.deviceStatus : 2}))
                    (
                      <StatusSelect options={deviceStatusSelect} placeholder='状态'/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              :
              null
          }

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