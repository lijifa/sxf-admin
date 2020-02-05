import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Input, Checkbox, Timeline } from 'antd';
import {responseMsg, covertMoney} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const namespace = 'partnerchange';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPdrPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    this.getPayType()
  }

  getPayType = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  state = {
    nextFlag: 0,
    wxDown: 1,
    wxOnline: 1
  }
  
  valueChanged(key, value) {
    let obj = {}
    obj[`${key}`] = value
    this.setState(obj)
  }

  //上一步
  onBackup = () => {
    const { clickNext } = this.props;
    clickNext(2, '', 'back')
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let submitData = ''
      submitData = fieldsValue.pdrList.map((item) => {
        return {
          id: item.id,
          partnerMapId: item.partnerMapId,
          paytypeMapId: item.paytypeMapId,
          mdrType: 0,
          transAmt1: 0,
          mdrPerFee1: item.mdrPerFee1,
          mdrFixFee1: covertMoney(item.mdrFixFee1, false) ,
          transAmt2: 0,
          mdrPerFee2: 0,
          mdrFixFee2: 0,
          transAmt3: 0,
          mdrPerFee3: 0,
          mdrFixFee3: 0
        }
      })

      //clickNext(3, submitData, 'submit')

      dispatch({
        type: `${namespace}/update`,
        payload: {
          changeOrder: detailData.changeOrder,
          pdrtmpsList: submitData
        },
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

  onChange = e => {
    this.setState({
      wxDown: e.target.value,
    });
  };

  mdrFixFeeRender = (key, label) => {
    return(
      <Checkbox onChange={(e)=>this.valueChanged(key, e.target.value)}>{label}</Checkbox>
    )
  }

  mdrTypeRender = () => {
    const {result, loading, detailData} = this.props
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    let options = ''
    if (!detailData) {
      options = result ? result.data : []
    }else{
      options = detailData
    }
    let payTypeRender = ''
    payTypeRender = options.map( (item, key) => {
      return <Timeline.Item key={item.paytypeId}>
      <p>{item.paytypeName} {item.paytypeId}</p>
      <Row gutter={16}>
        <Col span={8}>
          <FormItem label='手续费扣率'>
            {getFieldDecorator(`pdrList[${key}]['mdrPerFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrPerFee1 : 0}))
            (
              <Input addonAfter="%" placeholder='请输入扣率'/>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label={this.mdrFixFeeRender(`pdrList[${key}]['mdrFixFee1Flag']`,'手续费封顶')}>
            {getFieldDecorator(`pdrList[${key}]['mdrFixFee1']`, Object.assign({}, decoratorConfig, {initialValue: detailData ? item.mdrFixFee1 : 0}))
            (
              <Input placeholder='请输入手续费'/>
            )}
          </FormItem>
        </Col>
      </Row>
      <FormItem >
        {getFieldDecorator(`pdrList[${key}]['paytypeMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.paytypeMapId : item.paytypeId}))
        (
          <Input type='hidden' placeholder='支付方式'/>
        )}
      </FormItem>

      <FormItem >
        {getFieldDecorator(`pdrList[${key}]['parterMapId\']`, Object.assign({}, {}, {initialValue: detailData ? item.parterMapId : ''}))
        (
          <Input type='hidden' placeholder='支付方式'/>
        )}
      </FormItem>

      <FormItem >
        {getFieldDecorator(`pdrList[${key}]['id\']`, Object.assign({}, {}, {initialValue: detailData ? item.id : ''}))
        (
          <Input type='hidden' placeholder='支付方式'/>
        )}
      </FormItem>
    </Timeline.Item>
    })

    return payTypeRender
  }

  render() {
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical'>
          <Timeline>
            {this.mdrTypeRender()}
          </Timeline>

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
            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPdrPage);
export default EditFormPage