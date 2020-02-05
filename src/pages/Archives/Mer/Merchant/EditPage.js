import { Component } from 'react';
import { connect } from 'dva';
import { Form, Steps, Divider } from 'antd';
import EditInfoPage from './EditInfoPage';
import EditMriskPage from './EditMriskPage';
import EditCertPage from './EditCertPage';
import EditBankPage from './EditBankPage';
import EditPdrPage from './EditPdrPage';
import {responseMsg} from '@/utils/utils';
const { Step } = Steps;

const namespace = 'merchant';
@connect(({ merchant, loading }) => ({
  detailRes: merchant.detailRes,
  detailResLoading: loading.effects['merchant/detail'] ? true : false
}))

class EditPage extends Component {
  componentDidMount() {
    const { detailData } = this.props
    if (detailData) {
      this.getDetailData()
    }
  }
  state = {
    nextFlag: 0,
    submitData: [],
    merData: '',
    mriskData: '',
    mbankData: '',
    mcertData: '',
    mdrData: ''
  };

  // 获取单条详情数据
  getDetailData = () => {
    const { dispatch, detailData } = this.props;
    dispatch({
      type: `${namespace}/detail`,
      payload: {
        merMapId: detailData.merMapId,
        changeOrder: detailData.changeOrder
      }
    }).then(()=>{
      let pdata = this.props.detailRes
      
      this.setState(
        {
          merData: pdata.merchant,
          mbankData: pdata.mbank,
          mcertData: pdata.mcert,
          mdrData: pdata.mdrList,
          mriskData: pdata.mrisk
        }
      )
    });
  }

  addAction = () => {
    const { dispatch, onReturnList, detailData } = this.props;
    const { submitData, changeOrder } = this.state;
    let subData = ''
    if(detailData) {
      subData = {
        merchant: submitData[0],
        mrisk: submitData[1],
        mcert: submitData[2],
        mbank: submitData[3],
        mdrList: submitData[4]
      }
    }else{
      subData = {
        checkType: 0,
        merchant: submitData[0],
        mrisk: submitData[1],
        mcert: submitData[2],
        mbank: submitData[3],
        mdrList: submitData[4]
      }
    }

    dispatch({
      type: detailData ? `${namespace}/update` : `${namespace}/add`,
      payload: subData,
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
  nextAction = (step, data, flag='next') => {
    let { submitData } = this.state
    if (step > 4) {
      return
    }

    switch (flag) {
      case 'next':
        submitData[step] = data
        this.setState({
          nextFlag: step + 1,
          submitData: submitData
        })
        break;
      case 'back':
        submitData[step] = data
        this.setState({
          nextFlag: step
        })
      break;
      case 'submit':
        submitData[step] = data
        this.setState({
          submitData: submitData
        }, () => {
          this.addAction()
        })
      break;
    }
  }

  render() {
    const { nextFlag, merData, mriskData, mcertData, mbankData, mdrData } = this.state;
    return (
      <div>
        <Steps current={nextFlag} labelPlacement='vertical'>
          <Step title="基本信息" />
          <Step title="风控限额" />
          <Step title="证照信息" />
          <Step title="收款账户" />
          <Step title="支付扣率" />
        </Steps>
        <Divider />
        <div style={{display: nextFlag==0 ? 'block' : 'none'}}>
          <EditInfoPage
            clickNext={this.nextAction}
            detailData={merData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==1 ? 'block' : 'none'}}>
          <EditMriskPage
            clickNext={this.nextAction}
            detailData={mriskData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==2 ? 'block' : 'none'}}>
          <EditCertPage
            clickNext={this.nextAction}
            detailData={mcertData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==3 ? 'block' : 'none'}}>
          <EditBankPage
            clickNext={this.nextAction}
            detailData={mbankData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==4 ? 'block' : 'none'}}>
          <EditPdrPage
            clickNext={this.nextAction}
            detailData={mdrData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage