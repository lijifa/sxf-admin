import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { TweenOneGroup } from 'rc-tween-one';
import { Form, Button, Spin, Input, Row, Col, Radio, Tabs, Tag, Icon, message } from "antd";
import {responseMsg, getOrgData} from '@/utils/utils';
import DevTypeSelect from '@/components/TKDevTypeSelect';
import OrgSelect from '@/components/TKOrgSelect';
import StatusSelect from '@/components/MsStatusSelect';
import styles from './styles.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
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
class DevIn extends Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',

    devbrandMapId: '',
    modelCode: '',
    partnerMapId: this.props.detailData ? this.props.detailData.partnerMapId : 0,
    partnerMapIdP: this.props.detailData ? this.props.detailData.partnerMapIdP : 0,
    instMapId: this.props.detailData ? this.props.detailData.instMapId : 0,
  }

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
    const { devbrandMapId, modelCode, instMapId, partnerMapId, partnerMapIdP, tags } = this.state;
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (tags.length < 1) {
        message.error('请添加设备序列号')
        return
      }
      const {
        deviceStatus,
        deviceAttach
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        deviceSnList: tags,
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

  //关闭标签
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  //显示标签
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  //修改标签
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
        style={{
          background: '#fff',
          borderStyle: 'dashed',
          margin: '8px',
          width: '200px',
          textAlign: 'center',
          height: '30px',
          lineHeight: '30px',
          fontSize: '16px',
        }}>
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };





  render () {
    const { form } = this.props
    //const { submiting } = this.state
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);
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

          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='入库批次'>
                {getFieldDecorator('devBatchId', Object.assign({}, decoratorConfig, {initialValue: ''}))
                (
                  <Input placeholder='请输入入库批次'/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* <Col span={16}>
              <FormItem label='设备序列号'>
                {getFieldDecorator('deviceSn', Object.assign({}, decoratorConfig, {initialValue: ''}))
                (
                  <Input placeholder='请输入设备序列号'/>
                )}
              </FormItem>
            </Col> */}

            <div style={{padding: '8px', marginLeft: '8px', border: '1px solid #ccc', width: '220px'}} >
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                  onComplete: e => {
                    e.target.style = '';
                  },
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                {tagChild}
              </TweenOneGroup>
            </div>
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                style={{
                  margin: '8px',
                  width: '220px',
                  height: '40px',
                  lineHeight: '40px',
                  fontSize: '16px',
                }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && (
              <Tag
                onClick={this.showInput}
                style={{
                  background: '#fff',
                  borderStyle: 'dashed',
                  margin: '8px',
                  width: '220px',
                  textAlign: 'center',
                  height: '40px',
                  lineHeight: '40px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                <Icon type="plus" /> 设备序列号
              </Tag>
            )}
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

const DevInFormPage = Form.create()(DevIn);
export default DevInFormPage