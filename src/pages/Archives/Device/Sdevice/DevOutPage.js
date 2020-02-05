import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Spin, Input, Row, Col } from "antd";
import {responseMsg, changeTime} from '@/utils/utils';
import DevTypeSelect from '@/components/TKDevTypeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import StatusSelect from '@/components/MsStatusSelect';
import styles from './styles.less';
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
class DevOut extends Component {
  constructor (props) {
    super(props)
  }

  state = {
    devbrandMapId: '',
    modelCode: '',
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
  }

  //获取组织数据
  onChangeOrg = (data) => {
    if (data[0]) {
      this.setState({
        instMapId: data[0].id
      })
    }
    if (data[1]) {
      this.setState({
        partnerMapId: data[1].id
      })
    }
    if (data[2]) {
      this.setState({
        partnerMapIdP: data[2].id
      })
    }
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


  render () {
    const { form } = this.props
   //const { submiting, checkNum, isSubmit, createGrpFlag, skuGrpData, skuGrpId1 } = this.state
    const { getFieldDecorator } = form

    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    return(
      <div className={styles.editFormItem} style={{height: 'calc(100vh - 80px)'}}>
        <Form onSubmit={this.handleSubmit} >
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='归属'>
                {getFieldDecorator('orgData', Object.assign({}, decoratorConfig, {initialValue: []}))
                (
                  <OrgSelect
                    allData={true}
                    placeholder='请选择归属机构'
                    onChange={(val) => this.onChangeOrg(val)}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='隶属标识'>
                {getFieldDecorator('deviceAttach', Object.assign({}, decoratorConfig, {initialValue: 0}))
                (
                  <StatusSelect options={deviceAttachSelect} placeholder='隶属标识'/>
                )}
              </FormItem>
            </Col>
          </Row>
          <hr style={{ height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc' }}/>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='品牌/型号'>
                {getFieldDecorator('devData', Object.assign({}, decoratorConfig, {initialValue: []}))
                (
                  <DevTypeSelect
                    allData={true}
                    placeholder='请选择品牌/型号'
                    onChange={(val)=>this.onChangeDevType(val)}
                  />
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
    )
  }
}

const DevOutFormPage = Form.create()(DevOut);
export default DevOutFormPage