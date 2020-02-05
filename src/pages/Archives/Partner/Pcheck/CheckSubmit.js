import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Radio } from 'antd';
import { responseMsg } from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const RadioGroup = Radio.Group

const namespace = 'partnercheck';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditBankPage extends Component {
  state = {
    checkStatus: '0'
  }

  onChangeAcctType = (e) => {
    this.setState({
      checkStatus: e
    })
  }
  
  handleSubmit = e => {
    e.preventDefault();

    const {
      checkStatus
    } = this.state;
    const { dispatch, form, detailData, onReturnList, onClose } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {
        dataReserve
      } = fieldsValue

      const values = {
        id: detailData ? detailData.id : '',	
        checkStatus: checkStatus,
        dataReserve
      };

      dispatch({
        type: `${namespace}/update`,
        payload: values,
        callback: (res) => {
          if (res) {
            if (res.code == '00') {
              responseMsg(res)
              onClose()
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
    const {
      checkStatus,
    } = this.state;

    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' style={{textAlign: 'left'}} >
          <Row gutter={16}>
            <Col span={16}>
              <FormItem label='是否通过'>
                {getFieldDecorator('checkStatus', Object.assign({}, decoratorConfig, {initialValue: checkStatus}))
                (
                  <RadioGroup onChange={(e) => this.onChangeAcctType(e.target.value)}>
                    <Radio value={'0'}>审核通过</Radio>
                    <Radio value={'2'}>审核拒绝</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
           
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='拒绝原因'>
                {getFieldDecorator('dataReserve', Object.assign({}, {decoratorConfig}, {initialValue: detailData ? detailData.dataReserve : ''}))
                (<Input.TextArea rows={4} placeholder='请输入拒绝原因' maxLength={100}/>)}
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
              取 消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>确 认</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditBankPage);
export default EditFormPage