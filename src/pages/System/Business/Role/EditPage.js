import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Radio } from 'antd';
import {responseMsg, getOrgData, getOrgStr} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import MerSelect from '@/components/TKMerSelect';
import styles from './styles.less';

const FormItem = Form.Item;
const roleStatusSelect =  [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'}
]
const roleFitSelect =  [
  {key: 0, value: '系统'},
  {key: 1, value: '机构'},
  {key: 2, value: '商户'},
  {key: 3, value: '门店'}
]
const namespace = 'role';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  state = {
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
    merMapId: '',
    portalId: this.props.detailData ? this.props.detailData.portalId : 1,
  };

  //获取组织数据
  onChangeOrg = (data) => {
    let odata = ''
    odata = getOrgData(data, 0)
    this.setState({
      instMapId: odata.instMapId,
      partnerMapId: odata.partnerMapId,
      partnerMapIdP: odata.partnerMapIdP
    })
  }

  valueChanged = (key, value) => {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  //选择适用平台
  chooseOrg = (val) => {
    this.setState({
      partnerMapIdP: 0,
      partnerMapId: 0,
      instMapId: 0,
      merMapId: 0,
      portalId: val
    })
  }

  handleSubmit = e => {
    e.preventDefault();

    const { instMapId, partnerMapId, partnerMapIdP, merMapId, portalId } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        roleName, //角色名称
        flagStatus, //启用状态
      } = fieldsValue
      const values = {
        roleName, //角色名称	
        instMapId,
        partnerMapIdP,
        partnerMapId,
        merMapIdP: 0,
        merMapId,
        shopMapId: 0,
        portalId,
        flagStatus, //启用状态
        roleMapId: detailData ? detailData.roleMapId : ''
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
    const { portalId } = this.state;
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Fragment>
        <div className={styles.editFormItem}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <FormItem label='角色名称'>
              {getFieldDecorator('roleName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.roleName : ''}))
              (<Input placeholder='请输入角色名称' />)}
            </FormItem>
            <FormItem label='角色适用'>
              {getFieldDecorator('portalId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.portalId : 1}))
              (
              <Radio.Group onChange={(val) => this.chooseOrg(val.target.value)}>
                <Radio style={radioStyle} value={1}>
                  平台
                </Radio>
                <Radio style={radioStyle} value={2}>
                  机构
                </Radio>
                <Radio style={radioStyle} value={3}>
                  渠道
                </Radio>
                <Radio style={radioStyle} value={4}>
                  商家
                </Radio>
                <Radio style={radioStyle} value={5}>
                  门店
                </Radio>
              </Radio.Group>
              )}
            </FormItem>
            {portalId == 2 ? <FormItem label='归属机构'>
              {getFieldDecorator('instMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.instMapId : ''}))
              (
                <InstitudeSelect placeholder='请输入归属机构' onChange={(val) => this.valueChanged('instMapId', val)}/>
              )}
            </FormItem> : ''}

            {portalId == 3 ? <FormItem label='所属组织'>
              {getFieldDecorator('orgData', Object.assign({}, decoratorConfig, {initialValue: detailData ? getOrgStr(detailData, 'array') : []}))
              (
                <OrgSelect
                  allData={true}
                  placeholder='请选择所属组织'
                  onChange={(val) => this.onChangeOrg(val)}
                  editValue={detailData ? getOrgStr(detailData, 'array') : ''}
                />
              )}
            </FormItem> : ''}

            {portalId == 4 ? <FormItem label='商户'>
              {getFieldDecorator('merMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merMapId : 0}))
              (
                <MerSelect placeholder='请选择商户' onChange={(val) => this.valueChanged('merMapId', val)}/>
              )}
            </FormItem> : ''}

            <FormItem label='角色状态'>
              {getFieldDecorator('flagStatus', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.flagStatus : 0}))
              (<StatusSelect
                  options={roleStatusSelect}
                  placeholder='请选择角色状态'
                />
              )}
            </FormItem>

            <FormItem label='描述'>
              {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
              (<Input.TextArea rows={4} placeholder='在这里添加描述内容' />)}
            </FormItem>
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
      </Fragment>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage