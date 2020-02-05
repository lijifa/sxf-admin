import { Component } from 'react';
import { connect } from 'dva';
import { Form, Steps, Divider } from 'antd';
import EditInfoPage from './EditInfoPage';
import EditCertPage from './EditCertPage';
import EditBankPage from './EditBankPage';
import EditPdrPage from './EditPdrPage';
import {responseMsg} from '@/utils/utils';
const { Step } = Steps;

const namespace = 'partner';
@connect(({ partner, loading }) => ({
  detailRes: partner.detailRes,
  detailResLoading: loading.effects['partner/detail'] ? true : false
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
    changeOrder: '',
    submitData: [],
    partnerData: '',
    pbankData: '',
    pcertData: '',
    pdrData: ''
  };

  // 获取单条详情数据
  // getDetailData = () => {
  //   const { dispatch, detailId } = this.props;
  //   dispatch({
  //     type: `${namespace}/detail`,
  //     payload: {
  //       id: detailId
  //     }
  //   }).then(()=>{
  //     let pdata = this.props.detailRes
  //     this.setState(
  //       {
  //         changeOrder: pdata.changeOrder,
  //         partnerData: pdata.partner,
  //         pbankData: pdata.pbanktmp,
  //         pcertData: pdata.pcerttmp,
  //         pdrData: pdata.pdrtmpsList
  //       }
  //     )
  //   });
  // }

  // 获取单条详情数据
  getDetailData = () => {
    const { detailData, pageFlag } = this.props;
    let pdata_1 = '', pdata_2 = '', pdata_3 = ''
    switch (pageFlag) {
      case 1:
        pdata_1 = detailData.itemData
        break;
      case 2:
        pdata_2 = detailData.itemData
        break;
      case 3:
        pdata_3 = detailData.itemData
        break;
    }
    this.setState({
      nextFlag: pageFlag,
      pcertData: pdata_1,
      pbankData: pdata_2,
      pdrData: pdata_3,
    })
    // dispatch({
    //   type: `${namespace}/detail`,
    //   payload: {
    //     id: detailId
    //   }
    // }).then(()=>{
    //   let pdata = this.props.detailRes
    //   // this.setState(
    //   //   {
    //   //     changeOrder: pdata.changeOrder,
    //   //     partnerData: pdata.partner,
    //   //     pbankData: pdata.pbanktmp,
    //   //     pcertData: pdata.pcerttmp,
    //   //     pdrData: pdata.pdrtmpsList
    //   //   }
    //   // )
    // });
  }

  addAction = () => {
    const { dispatch, onReturnList, detailId } = this.props;
    const { submitData, changeOrder } = this.state;
    let subData = ''
    if(detailId) {
      subData = {
        changeOrder: changeOrder ? changeOrder : '',
        partner: submitData[0],
        pcerttmp: submitData[1],
        pbanktmp: submitData[2],
        pdrtmpsList: submitData[3]
      }
    }else{
      subData = {
        changeOrder: changeOrder ? changeOrder : '',
        checkType: 0,
        partner: submitData[0],
        pcert: submitData[1],
        pbank: submitData[2],
        pdrList: submitData[3]
      }
    }
    
    dispatch({
      type: detailId ? `${namespace}/update` : `${namespace}/add`,
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
    if (step > 3) {
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
    const { nextFlag, partnerData, pcertData, pbankData, pdrData } = this.state;
    const { onClose, onReturnList } = this.props;
    return (
      <div>
        {/* <Steps current={nextFlag} labelPlacement='vertical'>
          <Step title="基本信息" />
          <Step title="证照信息" />
          <Step title="收款账户" />
          <Step title="支付扣率" />
        </Steps>
        <Divider />
        <div style={{display: nextFlag==0 ? 'block' : 'none'}}>
          <EditInfoPage
            clickNext={this.nextAction}
            detailData={partnerData}
            onClose={this.props.onClose}
            nextFlag={nextFlag}
          />
        </div> */}
        <div style={{display: nextFlag==1 ? 'block' : 'none'}}>
          <EditCertPage
            detailData={pcertData}
            onClose={onClose}
            onReturnList={onReturnList}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==2 ? 'block' : 'none'}}>
          <EditBankPage
            detailData={pbankData}
            onClose={onClose}
            onReturnList={onReturnList}
            nextFlag={nextFlag}
          />
        </div>
        <div style={{display: nextFlag==3 ? 'block' : 'none'}}>
          <EditPdrPage
            detailData={pdrData}
            onClose={onClose}
            onReturnList={onReturnList}
            nextFlag={nextFlag}
          />
        </div>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage