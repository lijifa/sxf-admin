import React, { Component } from 'react';
import Link from 'umi/link';
import { Row, Col, Form, Icon, Badge } from 'antd';
import { connect } from 'dva';
import { formatTime, covertMoney2Yuan} from '@/utils/utils';
import { getAuthority } from '@/utils/authority';
import indexStyle from './styles.less';

const namespace = 'home';

@connect(({ home }) => ({
  result: home.data.data,
}))
export default class Home extends Component {
  state = {
    queryParam: {},
    isOpen: false
  };
  componentDidMount() {
    this.searchList()
  }

  searchList() {
    const { dispatch } = this.props;
    const { queryParam } = this.state
    dispatch({
      type: `${namespace}/search`,
      payload: queryParam
    });
  }

  renderNotice(noticeList) {
    if(noticeList) {
      const noticeTitleList = noticeList.map((item) => {
        return item.noticeTitle
      })
      
      let html = []
      for(let i = 0; i < noticeTitleList.length; i++) {
        html.push(<p key={i}>{noticeTitleList[i]}</p>)
      }
      return html
    }
  }

  disTotalBox(){
    const {isOpen} = this.state
    this.setState({
      isOpen: !isOpen
    })
  }

  checkPower(path) {
    let allPower = getAuthority()
    if (allPower.indexOf(path) >= 0) {
      return true;
    }else{
      return false
    }
  }

  render() {
    const { totalUser, toatlDayMeal, totalUserAcct, totalDaySale, noticeList} = this.props.result
    const { isOpen } = this.state
    const disTotalCss = {background: '#00a65d', padding: '10px', textAlign:'center', cursor: 'pointer'}
    return (
      <div style={{background:'#fff'}}>
        <Row className={indexStyle.indexTag} style={{display: isOpen ? 'block' : 'none'}}>
          <Col md={6} sm={24} className={indexStyle.moneyTagRight}>
            <div style={{background:'#00a65d'}}>
              <p className={indexStyle.title}>员工总数</p>
              <p className={String(totalUser).length > 8 ? indexStyle.longcontent : indexStyle.content}>{totalUser} <span className={indexStyle.unit}>人</span></p>
            </div>
          </Col>
          <Col md={6} sm={24} className={indexStyle.moneyTagRight}>
            <div style={{background:'#00aff2'}}>
              <p className={indexStyle.title}>昨日就餐次数</p>
              <p className={String(toatlDayMeal).length > 8 ? indexStyle.longcontent : indexStyle.content}>{toatlDayMeal} <span className={indexStyle.unit}>人</span></p>
            </div>
          </Col>

          <Col md={6} sm={24} className={indexStyle.moneyTagRight}>
            <div style={{background:'#6e66dd'}}>
              <p className={indexStyle.title}>账户余额</p>
              <p className={String(totalUserAcct).length > 8 ? indexStyle.longcontent : indexStyle.content}>{covertMoney2Yuan(totalUserAcct)} <span className={indexStyle.unit}>元</span></p>
            </div>
          </Col>

          <Col md={6} sm={24} className={indexStyle.moneyTagRight}>
            <div style={{background:'#fe5c60'}}>
              <p className={indexStyle.title}>昨日消费总额</p>
              <p className={String(totalDaySale).length > 8 ? indexStyle.longcontent : indexStyle.content}>{covertMoney2Yuan(totalDaySale)} <span className={indexStyle.unit}>元</span></p>
            </div>
          </Col>
        </Row>
        <Row className={indexStyle.indexTag}>
          <Col md={24} sm={24} className={indexStyle.moneyTagRight}>
            <div style={disTotalCss} onClick={()=>{this.disTotalBox()}}>
              { isOpen ? <span>点击收起统计数据 <Icon type='caret-up' /></span> : <span>点击展开统计数据 <Icon type='caret-down' /></span>}
            </div>
          </Col>
          
        </Row>
        <Row className={indexStyle.indexTitle}>
          未处理事件
        </Row>
        <Row className={indexStyle.indexTitle}>
          <Link to={'/system/notice'} style={{float: 'left', display: this.checkPower('/system/notice') ? 'block' : 'none'}}>
            <Badge><div className={indexStyle.eventBtn}>通知审核</div></Badge>
          </Link>
          <Link to={'/restaurant/menu-notice'} style={{float: 'left', display: this.checkPower('/restaurant/menu-notice') ? 'block' : 'none'}}>
            <Badge><div className={indexStyle.eventBtn} style={{marginLeft:'30px'}}>菜单预告</div></Badge>
          </Link>
        </Row>
        
        <Row>
          <Col span={12}>
            <div className={indexStyle.indexTitle} style={{borderRight:'1px solid #eee'}}>
              快捷操作
            </div>
            <div className={indexStyle.indexContent} style={{borderRight:'1px solid #eee', float:'left',paddingLeft:'10px', width: '100%'}}>
              <Link to={'/vipcard/accountrecharge'} style={{display: this.checkPower('/vipcard/accountrecharge') ? 'block' : 'none'}}>
                <div className={indexStyle.quickBtnBlue}><Icon type="idcard" theme="outlined" style={{marginRight:10}}/>批量充值</div>
              </Link>
              <Link to={'/system/notice'} style={{display: this.checkPower('/system/notice') ? 'block' : 'none'}}>
                <div className={indexStyle.quickBtnYellow}><Icon type="message" theme="outlined" style={{marginRight:10}}/>通知审核</div>
              </Link>
              <Link to={'/vipcard/tempcardauth'} style={{display: this.checkPower('/vipcard/tempcardauth') ? 'block' : 'none'}}>
                <div className={indexStyle.quickBtnGreen}><Icon type="safety-certificate" theme="outlined" style={{marginRight:10}}/>临时授权</div>
              </Link>
              <Link to={'/system/item'} style={{display: this.checkPower('/system/item') ? 'block' : 'none'}}>
                <div className={indexStyle.quickBtnPurple}><Icon type="shopping" theme="outlined" style={{marginRight:10}}/>商品管理</div>
              </Link>
            </div>
          </Col>
          <Col span={12}>
            <div className={indexStyle.indexTitle}>
              最新公告
            </div>
            <div className={indexStyle.indexContent}>
              {this.renderNotice(noticeList)}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}