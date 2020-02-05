import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Select, Row, Col, DatePicker, Divider } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import styles from './styles.less';
import TKHostSelect from '@/components/TKHostSelect';
import StatusSelect from '@/components/MsStatusSelect';
import MerSearch from '@/components/TKMerSelect/merSearch';
import CardTypeSelect from '@/components/TKCardTypeSelect';

const Search = Input.Search;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const cdFlagSelect =  [
  {key: 0, value: '借记卡'},
  {key: 1, value: '贷记卡'},
  {key: 2, value: '准贷记卡'}
]
const cardTrackSelect =  [
  {key: 2, value: '二磁道'},
  {key: 3, value: '三磁道'}
]

const namespace = 'phmer';
@connect(({ phmer, merchant, loading }) => ({
  result: phmer.selectData,
  resultMerDetail: merchant.detailRes,
  loading: loading.effects['phmer/queryAll'] ? true : false,
}))

class EditPage extends Component {

    state = {
      merNo: this.props.detailData ? this.props.detailData.merNo : '',
      merName: this.props.detailData ? this.props.detailData.merName : '',
      merNameEn: this.props.detailData ? this.props.detailData.merNameEn : '',
      hostMapId: this.props.detailData ? this.props.detailData.hostMapId : '',
    };
    
   //获取商户详情
  //  getMerDetail = (merNo) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //       type: `merchant/detail`,
  //       payload: {
  //         merNo: merNo
  //       }
  //   }).then(()=>{
  //     let response = this.props.resultMerDetail;
  //     this.setState({
  //       merNo: merNo,
  //       merName: response.data.merName,
  //       merNameEn: response.data.merNameEn,
  //     })
  //   });
  // }

  getMerData = (data) => {
    this.setState({
      //merMapId: data.merMapId,
      merNo: data.merNo,
      merName: data.merName,
      merNameEn: data.merNameEn
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { hostMerNo, hostMerName, hostMerAddress, dataReserve } = fieldsValue
      const { merNo,hostMapId } = this.state
 
      const values = {
        id: detailData ? detailData.id : '',
        merNo,
        hostMapId,
        hostMerNo,
        hostMerName,
        hostMerAddress,
        checkStatus: 0,
        dataReserve
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
    const { merNo, merName } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
        fontWeight: 'bold'
    }

    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              {
                detailData ?
                  <div>
                    <p style={detailTitle}>平台商户编号</p>
                    <p style={detailText}>{detailData.merNo}</p>
                  </div>
                :
                  // <FormItem label='平台商户编号'>
                  //   {getFieldDecorator('merNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.merNo : ''}))
                  //     (<Search
                  //       placeholder="请输入平台商户编号"
                  //       style={{ width: 200 }}
                  //       onSearch={(val)=>{ this.getMerDetail(val) }}
                  //     />
                  //   )}
                  // </FormItem>

                <FormItem className='inputW210' label='平台商户'>
                  {getFieldDecorator('merData', Object.assign({}, decoratorConfig, {initialValue: ''}))
                  (
                    <MerSearch
                      placeholder="请选择商户"
                      getmore={(data) => this.getMerData(data)}
                      merName={merName}
                    />
                  )}
                </FormItem>
              }
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户名称</p>
                <p style={detailText}>{ this.state.merName }</p>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <p style={detailTitle}>商户英文名称</p>
                <p style={detailText}>{ this.state.merNameEn }</p>
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='归属通道'>
                {getFieldDecorator('hostMapId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMapId : []}))
                  (<TKHostSelect
                    placeholder='请选择归属通道'
                    onChange={(val)=>{ this.setState({ hostMapId: val }) }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label='报备商户编号'>
                {getFieldDecorator('hostMerNo', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMerNo : ''}))
                (<Input placeholder='请输入报备商户编号' maxLength={30}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='报备商户名称'>
                {getFieldDecorator('hostMerName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMerName : ''}))
                (<Input placeholder='请输入报备商户名称' maxLength={30}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='报备商户地址'>
                {getFieldDecorator('hostMerAddress', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.hostMerAddress : ''}))
                (<Input placeholder='请输入报备商户地址' maxLength={60}/>)}
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='备注'>
                {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (<Input.TextArea rows={4} placeholder='请输入备注' />)}
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