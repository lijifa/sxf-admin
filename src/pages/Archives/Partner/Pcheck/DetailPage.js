import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Form, Steps, Divider, Modal } from 'antd';
import DetailInfoPage from './DetailInfoPage';
import DetailCertPage from './DetailCertPage';
import DetailBankPage from './DetailBankPage';
import DetailPdrPage from './DetailPdrPage';
import CheckSubmit from './CheckSubmit';
import {responseMsg} from '@/utils/utils';
const { Step } = Steps;

const namespace = 'partnercheck';
@connect(({ partnercheck, loading }) => ({
  partnerDetailRes: partnercheck.partnerDetailRes,
  pcheckDetailRes: partnercheck.pcheckDetailRes,
  partnerDetailResLoading: loading.effects['partnercheck/partnerdetail'] ? true : false,
  pcheckDetailResLoading: loading.effects['partnercheck/pcheckdetail'] ? true : false
}))

class DetailPage extends Component {
  componentDidMount() {
    const { detailData } = this.props
    if (detailData) {
      this.getPartnerDetailData()
      this.getPcheckDetailData()
    }
  }
  state = {
    nextFlag: 0,
    changeOrder: '',
    submitData: [],
    partnerData: '',
    pbankData: '',
    pcertData: '',
    pdrData: '',

    pbankCheckData: '',
    pcertCheckData: '',
    pdrCheckData: '',
    checkVisible: false
  };

  // 获取单条进件详情数据
  getPartnerDetailData = () => {
    const { dispatch, detailData } = this.props;
    dispatch({
      type: `${namespace}/partnerdetail`,
      payload: {
        partnerMapId: detailData.partnerMapId
      }
    }).then(()=>{
      let pdata = this.props.partnerDetailRes
      this.setState(
        {
          //changeOrder: pdata.changeOrder,
          //partnerData: pdata.partner,
          pbankData: pdata.pbank,
          pcertData: pdata.pcert,
          pdrData: pdata.pdrList
        }
      )
    });
  }

  // 获取单条审核详情数据
  getPcheckDetailData = () => {
    const { dispatch, detailData } = this.props;
    dispatch({
      type: `${namespace}/pcheckdetail`,
      payload: {
        id: detailData.id
      }
    }).then(() => {
      let pdata = this.props.pcheckDetailRes
      this.setState(
        {
          //changeOrder: pdata.changeOrder,
          //partnerData: pdata.partner,
          pbankCheckData: pdata.pbanktmp,
          pcertCheckData: pdata.pcerttmp,
          pdrCheckData: pdata.pdrtmpsList
        }
      )
    });
  }

  addAction = () => {
    const { dispatch, onReturnList, detailId } = this.props;
    const { submitData, changeOrder } = this.state;
    let subData = {
      changeOrder: changeOrder ? changeOrder : '',
      checkType: 0,
      partner: submitData[0],
      pcert: submitData[1],
      pbank: submitData[2],
      pdrList: submitData[3]
    }
    
    dispatch({
      type: detailId ? `${namespace}/update` : `${namespace}/add`,
      payload: {
        subData,
        //merMapId: dataDetail ? dataDetail.merMapId : '',
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
  };

  //下一步
  nextAction = (step, flag='next') => {
    const { nextFlag } = this.state
    switch (flag) {
      case 'next':
        //submitData[step] = data
        this.setState({
          nextFlag: nextFlag + 1,
          //submitData: submitData
        })
        break;
      case 'back':
        //submitData[step] = data
        this.setState({
          nextFlag: nextFlag - 1
        })
      break;
      case 'submit':
        // submitData[step] = data
        // this.setState({
        //   submitData: submitData
        // }, () => {
        //   this.addAction()
        // })
      break;
    }
  }

  closeCheckModel = () => {
    const { checkVisible } = this.state
    this.setState({
      checkVisible: !checkVisible,
    });
  };

  render() {
    const {
      nextFlag,
      pcertData,
      pbankData,
      pdrData,
      pcertCheckData,
      pbankCheckData,
      pdrCheckData,
      checkVisible
    } = this.state;
    const {
      detailData
    } = this.props
    return (
      <Fragment>
        <Row style={{margin: '-24px -24px 0'}}>
          <Col span={12} style={{background: '#fff',
              color: '#666',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '10px',
              }}>变更前内容</Col>
          <Col span={12} style={{background: '#eee',
              color: '#666',
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '10px',
            }}>审核详情</Col>
        </Row>
        <Row style={{
            marginLeft: '-24px',
            marginRight: '-24px',
            background: '#eeee',
          }}>
          <Col span={12} style={{
            padding: '16px',
            }}>
            <Steps current={nextFlag} size="small">
              <Step title="证照信息" />
              <Step title="收款账户" />
              <Step title="支付扣率" />
            </Steps>
            <Divider />
            <div style={{display: nextFlag==0 && pcertData.id ? 'block' : 'none'}}>
              <DetailCertPage
                clickNext={this.nextAction}
                detailData={pcertData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
            <div style={{display: nextFlag==1 && pbankData.id ? 'block' : 'none'}}>
              <DetailBankPage
                clickNext={this.nextAction}
                detailData={pbankData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
            <div style={{display: nextFlag==2 && pdrData.length > 0 ? 'block' : 'none'}}>
              <DetailPdrPage
                clickNext={this.nextAction}
                detailData={pdrData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
          </Col>
          <Col span={12} style={{
            background: '#fff',
            padding: '16px'
          }}>
            <Steps current={nextFlag} size="small">
              <Step title="证照信息" />
              <Step title="收款账户" />
              <Step title="支付扣率" />
            </Steps>
            <Divider />
            <div style={{display: nextFlag==0 ? 'block' : 'none'}}>
              <DetailCertPage
                clickNext={this.nextAction}
                detailData={pcertCheckData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
            <div style={{display: nextFlag==1 ? 'block' : 'none'}}>
              <DetailBankPage
                clickNext={this.nextAction}
                detailData={pbankCheckData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
            <div style={{display: nextFlag==2 ? 'block' : 'none'}}>
              <DetailPdrPage
                clickNext={this.nextAction}
                detailData={pdrCheckData}
                onClose={this.props.onClose}
                nextFlag={nextFlag}
              />
            </div>
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
          { nextFlag > 0 ? <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.nextAction('1','back')}>上一步</Button> : ''}
          { nextFlag < 2 ? <Button style={{ marginRight: 8 }} type="primary" onClick={() => this.nextAction('2','next')}>下一步</Button> : ''}
          { nextFlag == 2 ? <Button type="primary" onClick={() => this.closeCheckModel()}>提 交</Button> : ''}
        </div>

        <Modal
          title="审核提交"
          centered={true}
          visible={checkVisible}
          maskClosable={false}
          bodyStyle={{textAlign:'center', height: '400px'}}
          width={600}
          footer={null}
          onCancel={()=>{this.closeCheckModel()}}
        >
          <CheckSubmit
            detailData={detailData}
            onClose={this.closeCheckModel}
            onReturnList={this.props.onReturnList}
          />
        </Modal>
      </Fragment>
    );
  }
}

const DetailFormPage = Form.create()(DetailPage);
export default DetailFormPage