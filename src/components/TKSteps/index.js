import React, { Component } from 'react'
import { Steps, Popover } from 'antd'
const { Step } = Steps;

export default class TKSteps extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Steps current={1} labelPlacement='vertical'>
        <Step title="基本信息"  />
        <Step title="证照信息" />
        <Step title="收款账户" />
        <Step title="支付扣率" />
      </Steps>
    )
  }
}