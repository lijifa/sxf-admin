import { Component } from 'react';
import { connect } from 'dva';
import { Form, Steps, Divider } from 'antd';
import DetailInfoPage from './DetailInfoPage';
import DetailCertPage from './DetailCertPage';
import DetailBankPage from './DetailBankPage';
import DetailPdrPage from './DetailPdrPage';
import {responseMsg} from '@/utils/utils';
const { Step } = Steps;

const namespace = 'partner';
@connect(({ partner, loading }) => ({
  detailRes: partner.detailRes,
  detailResLoading: loading.effects['partner/detail'] ? true : false
}))

class DetailPage extends Component {
  componentDidMount() {
    const { detailId } = this.props
    if (detailId) {
      this.getDetailData()
    }
  }
  state = {
    nextFlag: 0,
    changeOrder: '',
    submitData: [],
    partnerData: '',
    pbankData: '',
    pcertData: '',
    pdrData: ''
  };

  // 获取单条详情数据
  getDetailData = () => {
    const { dispatch, detailId } = this.props;
    dispatch({
      type: `${namespace}/detail`,
      payload: {
        id: detailId
      }
    }).then(()=>{
      let pdata = this.props.detailRes
      this.setState(
        {
          changeOrder: pdata.changeOrder,
          partnerData: pdata.partner,
          pbankData: pdata.pbanktmp,
          pcertData: pdata.pcerttmp,
          pdrData: pdata.pdrtmpsList
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
    const { nextFlag, partnerData, pcertData, pbankData, pdrData } = this.state;
    return (
      <div>
        <Steps current={nextFlag} labelPlacement='vertical'>
          <Step title="基本信息" />
          <Step title="证照信息" />
          <Step title="收款账户" />
          <Step title="支付扣率" />
        </Steps>
        <Divider />
        <div style={{display: nextFlag==0 ? 'block' : 'none'}}>
          <DetailInfoPage
            clickNext={this.nextAction}
            detailData={partnerData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==1 ? 'block' : 'none'}}>
          <DetailCertPage
            clickNext={this.nextAction}
            detailData={pcertData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==2 ? 'block' : 'none'}}>
          <DetailBankPage
            clickNext={this.nextAction}
            detailData={pbankData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==3 ? 'block' : 'none'}}>
          <DetailPdrPage
            clickNext={this.nextAction}
            detailData={pdrData}
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