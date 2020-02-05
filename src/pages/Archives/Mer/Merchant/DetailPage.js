import { Component } from 'react';
import { connect } from 'dva';
import { Form, Steps, Divider } from 'antd';
import DetailInfoPage from './DetailInfoPage';
import DetailMriskPage from './DetailMriskPage';
import DetailCertPage from './DetailCertPage';
import DetailBankPage from './DetailBankPage';
import DetailPdrPage from './DetailPdrPage';
import {responseMsg} from '@/utils/utils';
const { Step } = Steps;

const namespace = 'merchant';
@connect(({ merchant, loading }) => ({
  detailRes: merchant.detailRes,
  detailResLoading: loading.effects['merchant/detail'] ? true : false
}))

class DetailPage extends Component {
  componentDidMount() {
    const { detailData } = this.props
    if (detailData) {
      this.getDetailData()
    }
  }
  state = {
    nextFlag: 0,
    changeOrder: '',
    submitData: [],
    merData: '',
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
          changeOrder: pdata.changeOrder,
          merData: pdata.merchant,
          mriskData: pdata.mrisk,
          mbankData: pdata.mbank,
          mcertData: pdata.mcert,
          mdrData: pdata.mdrList
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
    switch (flag) {
      case 'next':
        //submitData[step] = data
        this.setState({
          nextFlag: step + 1,
          //submitData: submitData
        })
        break;
      case 'back':
        //submitData[step] = data
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
          <DetailInfoPage
            clickNext={this.nextAction}
            detailData={merData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==1 ? 'block' : 'none'}}>
          <DetailMriskPage
            clickNext={this.nextAction}
            detailData={mriskData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==2 ? 'block' : 'none'}}>
          <DetailCertPage
            clickNext={this.nextAction}
            detailData={mcertData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==3 ? 'block' : 'none'}}>
          <DetailBankPage
            clickNext={this.nextAction}
            detailData={mbankData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==4 ? 'block' : 'none'}}>
          <DetailPdrPage
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

const DetailFormPage = Form.create()(DetailPage);
export default DetailFormPage