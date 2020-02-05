import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Row, Col, Select, Radio } from "antd";
import { responseMsg, getOrgData } from '@/utils/utils';
import MerSelect from '@/components/TKMerSelect';
import OrgSelect from '@/components/TKOrgSelect';
import MposSearch from '@/components/TKMposSelect/mposSearch';
import MerSearch from '@/components/TKMerSelect/merSearch';
import styles from './styles.less';
const FormItem = Form.Item;
const namespace = 'sdevice';

@connect(({ sdevice }) => ({
  result: sdevice.editRes,
}))
class EditPage extends Component {

  state = {
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
      
    posNo: this.props.detailData ? this.props.detailData.posNo : '',
    posMapId: '',
    merMapId: '',
    merMapIdP: '',
    merNo: '',
    merName: '',
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;
    const { posNo, posMapId, merNo, merMapId } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        sdeviceId: detailData.id,	      //设备库存ID	
        deviceToken: detailData.id,     //临时密钥	
        casherNo: 0,                    //款台编号	
        posMapId,                       //终端id	
        shopMapId: 0,                   //门店id，无为0	
        posNo,                          //终端编号	
        merNo,                          //商户编号	
        merMapId,                       //安装商户	
        merMapIdP: 0                    //安装集团
      };

      dispatch({
        type: `idevice/add`,
        payload: values,
        callback: (res) => {
          if (res) {
            if (res.code == '00') {
              responseMsg(res)
              onReturnList()
            } else {
              responseMsg(res)
            }
          }
        }
      });
    });
  };

  //获取组织数据
  onChangeOrg = (data) => {
    let odata = ''
    odata = getOrgData(data)
    this.setState({
      instMapId: odata.instMapId,
      partnerMapId: odata.partnerMapId,
      partnerMapIdP: odata.partnerMapIdP
    })
  }

  getMposData = (data) => {
    this.setState({
      posMapId: data.posMapId,
      posNo: data.posNo
    })
  }

  getMerData = (data) => {
    this.setState({
      merMapId: data.merMapId,
      merMapIdP: data.merMapIdP,
      merNo: data.merNo,
      merName: data.merName,
    })
  }
  render() {
    const { posNo, merName, merMapId } = this.state;
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
              <FormItem label='品牌/型号' className='singleFormItem' >
                {detailData.devbrandName+ '/' +detailData.modelCode}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='设备序列号' className='singleFormItem' >
                {detailData.deviceSn}
              </FormItem>
            </Col>
          </Row>
          <hr style={{ height: '1px', marginBottom: '7px', border: 'none', borderTop: '1px dashed #ccc' }} />

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='安装商户'>
                {getFieldDecorator('merName', Object.assign({}, decoratorConfig, { initialValue: merName }))
                  (
                    <MerSearch
                      placeholder="请选择商户"
                      getmore={(data) => this.getMerData(data)}
                      merName={merName}
                      instMapId={detailData.instMapId}
                    />
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <FormItem className='inputW210' label='POS编号'>
                {getFieldDecorator('posNo', Object.assign({}, decoratorConfig, {initialValue: posNo}))
                (
                  <MposSearch
                    placeholder="请选择商户终端POS"
                    getmore={(data) => this.getMposData(data)}
                    posNo={posNo}
                    merMapId={merMapId}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={12}>
              <FormItem label='安装门店'>
                {getFieldDecorator('pos1', Object.assign({}, decoratorConfig, { initialValue: detailData ? detailData.comManapnusr : '' }))
                  (
                    <Input placeholder='请输入POS编号' />
                  )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='款台号'>
                {getFieldDecorator('pos2', Object.assign({}, decoratorConfig, { initialValue: detailData ? detailData.comManapnusr : '' }))
                  (
                    <Input placeholder='请输入POS编号' />
                  )}
              </FormItem>
            </Col>
          </Row> */}
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