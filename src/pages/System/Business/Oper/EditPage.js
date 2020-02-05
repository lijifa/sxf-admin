import { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Input, Row, Col, Radio, DatePicker } from 'antd';
import md5 from 'blueimp-md5'
import {responseMsg, getOrgData, getOrgStr} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import InstitudeSelect from '@/components/TKInstitudeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import RoleSelect from '@/components/TKRoleSelect';
import MerSearch from '@/components/TKMerSelect/merSearch';
import UploadImg from '@/components/MSupload';
import styles from './styles.less';

const FormItem = Form.Item;
const operStatusSelect =  [
  {key: 0, value: '平台'},
  {key: 1, value: '机构'},
  {key: 9, value: '渠道'},
  {key: 19, value: '商户'}
]
const flagStatusSelect =  [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'}
]
const operSexSelect =  [
  {key: 0, value: '未知'},
  {key: 1, value: '男'},
  {key: 2, value: '女'}
]

//let userDetail = JSON.parse(xCookie.get('userData'))
const namespace = 'oper';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  state = { 
    operType: this.props.detailData ? this.props.detailData.operType : 0,
    operHead: this.props.detailData ? this.props.detailData.operHead : '',
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
    merMapId: this.props.detailData ? this.props.detailData.merMapId : 0,
    portalId: this.props.detailData ? this.props.detailData.portalId : 1,
  }

  onChangeOperType = (val) => {
    this.setState({
      operType: val
    })
  }

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
    const { operHead, instMapId, partnerMapId, partnerMapIdP, merMapId, portalId } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      const values = {
        ...fieldsValue,
        id: detailData ? detailData.id : '',
        instMapId,
        partnerMapIdP,
        partnerMapId,
        merMapIdP:0,
        merMapId: merMapId,
        shopMapId:0,
        portalId: portalId, //服务id
        flagStatus: 0,      //启用状态
        operBirthday: 0,    //出生年月
        operEmail: 0,       //用户邮箱
        operLevel: 0,       //店员职位
        operEmployeeno: 0,  //店员工号
        operAuth: 0,        //店员权限
        operHead,           //店员头像
        
        operExp: fieldsValue.operExp.valueOf(),
        operMapId: detailData ? detailData.operMapId : '',
        operPwd: detailData ? undefined : md5(md5('000000').toUpperCase()).toUpperCase(),
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

  getMerData = (data) => {
    this.setState({
      instMapId: data.instMapId,
      partnerMapId: data.partnerMapId,
      partnerMapIdP: data.partnerMapIdP,
      merMapId: data.merMapId,
      merNo: data.merNo,
      merName: data.merName,
      merNameEn: data.merNameEn
    })
  }

  render() {
    const { detailData } = this.props;
    let orgArr = detailData ? detailData.orgName.split(' - ') : []
    const { operHead, merName, portalId } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    const isEdit = detailData ? true : false
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <Fragment>
        <div className={styles.editFormItem}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='登录账号' className='singleFormItem'>
                  {isEdit ? detailData.operNo : getFieldDecorator('operNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.operNo : ''}))
                  (<Input placeholder='请输入登录账号' />)
                }
                </FormItem>
                <FormItem label='用户名称'>
                  {getFieldDecorator('operName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.operName : ''}))
                  (<Input placeholder='请输入用户名称' />)}
                </FormItem>
                <FormItem label='用户手机'>
                  {getFieldDecorator('operMobile', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.operMobile : ''}))
                  (<Input placeholder='请输入用户手机' maxLength={11}/>)}
                </FormItem>
                <FormItem label='用户性别'>
                  {getFieldDecorator('operSex', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.operSex : 1}))
                  (<StatusSelect
                      options={operSexSelect}
                      placeholder='请选择用户性别'
                      onChange={(val)=>{this.onChangeOperType(val)}}
                    />
                  )}
                </FormItem>
                {isEdit ? '' :
                <FormItem label='用户密码' style={{display: isEdit ? 'none' : 'block'}}>
                  {getFieldDecorator('operPwd', Object.assign({}, {display: isEdit ? {} : decoratorConfig }, {initialValue: detailData ? detailData.operPwd : ''}))
                  (<Input type='password' placeholder='请输入用户密码' />)}
                </FormItem>}
              </Col>

              <Col span={12}>
                <UploadImg imgPath={operHead} onChange={(e)=>this.valueChanged('operHead', e)}/>
              </Col>
            </Row>
            <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc' }}/>

            <FormItem label='角色适用'>
              {getFieldDecorator('portalId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.portalId : 1}))
              ( <Radio.Group onChange={(val) => this.chooseOrg(val.target.value)}>
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
              {getFieldDecorator('orgData', Object.assign({}, decoratorConfig, {initialValue: detailData ? orgArr : []}))
              (
                <OrgSelect
                  allData={true}
                  placeholder='请选择所属组织'
                  onChange={(val) => this.onChangeOrg(val)}
                  editValue={detailData ? orgArr : ''}
                />
              )}
            </FormItem> : ''}

            {portalId == 4 ? <FormItem label='商户'>
              {getFieldDecorator('merMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merMapId : 0}))
              (
                <MerSearch
                  placeholder='请选择商户'
                  onChange={(val) => this.valueChanged('merMapId', val)}

                  getmore={(data) => this.getMerData(data)}
                  merName={merName}
                  //instMapId={detailData.instMapId}
                />
              )}
            </FormItem> : ''}

            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='所属角色'>
                  {getFieldDecorator('roleMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.roleMapId : ''}))
                    (<RoleSelect
                      placeholder='请选择所属角色'
                      onChange={(val)=>{this.onChangeOperType(val)}}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <FormItem label='账号到期'>
                  {getFieldDecorator('operExp', Object.assign({}, decoratorConfig, {initialValue: detailData ? moment(detailData.operExp) : moment('2099-12-31')}))
                  (
                    <DatePicker />
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
      </Fragment>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage