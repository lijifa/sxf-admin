import React, { Component } from 'react'
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

export default class MsHeadImg extends Component {
  constructor(props) {
    super(props);
  }

  headData = () => {
    const { userName } = this.props
    let userTmp = ''
    if (userName) {
      if (userName.length > 4) {
        userTmp = '临时'
      } else {
        userTmp = userName.substr(1)
      }
    }
    
    //var num = Math.floor(Math.random()*4+1);
    let num = 0;

    return {
      user: userTmp,
      bgColor: colorList[num]
    }
  }

  render() {
    const {size} = this.props
    let data = this.headData()
    const circle = {
      width:size,
      height:size,
      lineHeight:size+'px',
      borderRadius: size/2,
      backgroundColor: data.bgColor,
      textAlign:'center',
      verticalAlign: 'middle',
      fontSize: '60px',
      color: '#fff',
      margin: '0 auto'
    }
    return (
      <div style={circle}>
        {data.user}
      </div>
    );
  }
}