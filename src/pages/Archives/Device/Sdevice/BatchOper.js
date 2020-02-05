import { Component, Fragment } from 'react';
import { Form, Tabs } from "antd";
import DevInPage from './DevInPage';
import DevOutPage from './DevOutPage';

const TabPane = Tabs.TabPane;

class BatchOperPage extends Component {
  render() {
    return (
      <Fragment>
        <Tabs tabPosition='left'>
          <TabPane tab="新机入库" key="3">
            <DevInPage
              closeModel={this.props.closeModel}
              onReturnList={this.props.onReturnList}
            />
          </TabPane>
          
          <TabPane tab="导出" key="6">
            <DevOutPage
              closeModel={this.props.closeModel}
              onReturnList={this.props.onReturnList}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

const BatchFormPage = Form.create()(BatchOperPage);
export default BatchFormPage