import { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Button, Checkbox, Timeline } from 'antd';
import { formatTime, covertMoney2Yuan, getObjStatus} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;
const checkStatusSelect = [
  {key: 0, value: '通过审核'},
  {key: 1, value: '待审核'},
  {key: 2, value: '审核未通过'}
]
const namespace = 'paytype';
@connect(({ paytype, loading }) => ({
  result: paytype.selectData,
  loading: loading.effects['paytype/queryAll'] ? true : false,
}))

class EditPdrPage extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount () {
    //this.getPayType()
  }

  // componentWillReceiveProps(nextProps) {
  //   const { detailData, nextFlag } = nextProps;
  //   if ( detailData && nextFlag == 0 ) {
  //     this.setState({
  //       commRegionId: detailData ? detailData.commRegionId : '156',
  //       commCityId: detailData ? detailData.commCityId : '',
  //       commCityCountyName: detailData ? detailData.commCityCountyName : '',
  //       commCityName: detailData ? detailData.commCityName : '',
  //       commCityProvName: detailData ? detailData.commCityProvName : '',
  //       commCityZip: detailData ? detailData.commCityZip : '',
  //       customLogo: detailData ? detailData.customLogo : imgDemo
  //     })
  //   }
  // }

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
    clickNext(2, 'back')
  };

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, clickNext } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let submitData = ''
      submitData = fieldsValue.pdrList.map((item) => {
        return {
          id: detailData ? detailData.id : '',
          partnerMapId: 0,
          paytypeMapId: item.paytypeMapId,
          mdrType: 0,
          transAmt1: 0,
          mdrPerFee1: item.mdrPerFee1,
          mdrFixFee1: item.mdrFixFee1,
          transAmt2: 0,
          mdrPerFee2: 0,
          mdrFixFee2: 0,
          transAmt3: 0,
          mdrPerFee3: 0,
          mdrFixFee3: 0
        }
      })

      clickNext(2, 'back')
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
    if (!detailData) {
      return;
    }
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }
    let payTypeRender = ''
    payTypeRender = detailData.map( (item, key) => {
      return <Timeline.Item key={item.paytypeMapId}>
      <p>{item.paytypeMapId}</p>
      <Row gutter={16}>
        <Col span={8}>
          <div>
            <p style={detailTitle}>手续费扣率</p>
            <p style={detailText}>{item.mdrPerFee1} %</p>
          </div>
        </Col>
        <Col span={8}>
          <div>
            <p style={detailTitle}>手续费封顶</p>
            <p style={detailText}>{covertMoney2Yuan(item.mdrFixFee1)} 元</p>
          </div>
        </Col>
      </Row>
    </Timeline.Item>
    })

    return payTypeRender
  }

  render() {
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
      fontWeight: 'bold'
    }
    const {detailData} = this.props
    return (
      <div className={styles.editFormItem} style={{padding: '0 20px', marginBottom: '28px'}}>
        <Form layout='vertical'>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='商户名称' className='singleFormItem'>
                {detailData.merName}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='支付类型' className='singleFormItem'>
                {detailData.paytypeName}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='手续费扣率' className='singleFormItem'>
              {detailData.mdrPerFee1} %
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FormItem label='手续费封顶' className='singleFormItem'>
              {covertMoney2Yuan(detailData.mdrFixFee1)} 元
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <FormItem className='singleFormItem' label='审核状态'>
                {getObjStatus(checkStatusSelect, detailData.checkStatus)}
              </FormItem>
            </Col>
          </Row>

          <hr style={{height:'1px', marginBottom: '7px', border:'none', borderTop:'1px dashed #ccc'  }}/>

          <FormItem className='singleFormItem' label='创建时间'>
            {formatTime(detailData.timeCreate)}
          </FormItem>

          <FormItem className='singleFormItem' label='更新时间'>
            {formatTime(detailData.timeUpdate)}
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
            <Button type="primary" onClick={this.handleSubmit}>变 更</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPdrPage);
export default EditFormPage