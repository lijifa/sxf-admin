import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, DatePicker, Button, Table, Icon, Divider, Drawer, Popconfirm } from 'antd';
import {formatTime, responseMsg, getObjStatus, changeTime} from '@/utils/utils';
import styles from './styles.less';
const FormItem = Form.Item;

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    { <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} /> }
  </div>
);

const namespace = 'phpos';
@connect(({ phpos, loading }) => ({
  result: phpos.selectData,
  resultUpdatelistData: phpos.updatelistData,
  loading: loading.effects['phpos/queryAll'] ? true : false,
}))

class EditPage extends Component {
  
  state = {
    detailList: [],
  };

  componentDidMount() {
    this.getDetailList()
  }

  //获取终端列表
  getDetailList = () => {
    const { dispatch,detailData } = this.props;
    dispatch({
        type: `${namespace}/updatequery`,
        payload: {
          condition	:{
            merNo: detailData.merNo,
            posReportStatus: 1  //0未报备1已报备
          }
        }
    }).then(()=>{
      let response = this.props.resultUpdatelistData;
      this.setState({
        detailList: response.data.list
      })     
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { } = fieldsValue
      const { detailList } = this.state
      
      const values = {
        otherType: 1, //0：报备；1：修改
        batchParam: detailList
      };

      dispatch({
        type: `${namespace}/update`,
        payload: values,
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
    });
  };

  renderColumns = (text, record, column) => {
    return (
      <EditableCell
        value={text}
        onChange={value => this.handleChange(value, record.id, column)}
      />
    );
  }

  handleChange = (value, key, column) => {
    const newData = [...this.state.detailList];
    const target = newData.filter(item => key === item.id)[0];
    if (target) {
      target[column] = value;
      this.setState({
        detailList: newData
      });
    }
  }

  render() {
    const { detailData } = this.props;
    const { detailList } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    
    const detailTitle = {
      color: '#999',
      marginBottom: '5px'
    }

    const detailText = {
        fontWeight: 'bold'
    }

    const columns = [
      { title: '平台终端编号', dataIndex: 'posNo', key: 'posNo' },
      { title: '报备终端编号', dataIndex: 'hostPosNo', key: 'hostPosNo', render: (text, record) => this.renderColumns(text, record, 'hostPosNo') },
      { title: '批次号', dataIndex: 'phposBatch', key: 'phposBatch', render: (text, record) => this.renderColumns(text, record, 'phposBatch') },
      { title: '流水号', dataIndex: 'phposTrace', key: 'phposTrace', render: (text, record) => this.renderColumns(text, record, 'phposTrace') },
    ];


    let tableData = null
    let list = detailList
    if (list) {
      tableData = list.map((item, idx) => {
        const {
          id,
          instMapId,
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merNo,
          posNo,
          hostMapId,
          hostMerNo,
          hostPosNo,
          phposLoginFlag,
          phposBatch,
          phposTrace,
          hostKeyIndex,
          hostPosKey,
          dataReserve,
          timeUpdate,
          timeCreate,
          hostName,
          merName
        } = item

        return {
          key: idx,
          id,
          instMapId,
          partnerMapId,
          partnerMapIdP,
          merMapIdP,
          merMapId,
          merNo,
          posNo,
          hostMapId,
          hostMerNo,
          hostPosNo,
          phposLoginFlag,
          phposBatch,
          phposTrace,
          hostKeyIndex,
          hostPosKey,
          dataReserve,
          timeUpdate: formatTime(timeUpdate),
          timeCreate: formatTime(timeCreate),
          hostName,
          merName,
          posDevNum: ''
        }
      })
    }
    
    return (
      <Fragment>
        <div className={styles.editFormItem}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <p style={detailTitle}>归属通道</p>
                  <p style={detailText}>{detailData.hostName}</p>
                </div>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <p style={detailTitle}>平台商户编号</p>
                  <p style={detailText}>{detailData.merNo}</p>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <p style={detailTitle}>报备商户编号</p>
                  <p style={detailText}>{detailData.hostMerNo}</p>
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <p style={detailTitle}>商户名称</p>
                  <p style={detailText}>{ detailData.merName }</p>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <p style={detailTitle}>商户英文名称</p>
                  <p style={detailText}>{ detailData.merNameEn }</p>
                </div>
              </Col>
            </Row>

            <Divider />

            <Table
              bordered
              columns={columns}
              dataSource={tableData}
              size='small' />


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
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage