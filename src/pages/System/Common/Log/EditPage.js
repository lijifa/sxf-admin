import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Col, Row, Input, Divider, Table } from 'antd';
import { covertMoney, covertMoney2Yuan, responseMsg } from '@/utils/utils';
import UploadImg from '@/components/MSupload';
import styles from './styles.less';

const FormItem = Form.Item;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} 必填`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

const namespace = 'item';

@connect(({ item, loading }) => ({
  merData: item.merData,
  loading: loading.effects['item/queryAllMer'] ? true : false,
}))

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      { title: '适用商户', width: 120, dataIndex: 'merMapName', key: 'merMapName' },
      { title: '商品价格', width: 130, dataIndex: 'sellPrice', key: 'sellPrice', editable: true, },
    ]
    this.state = {
      selectedRowKeys:[],
      selectedRows: [],
      dataSource: [],
      imgPath: ''
    };
    this.getMerData()
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.merData != this.props.merData) {
  //     this.setState({
  //       dataSource: nextProps.merData
  //     })
  //   }
  // }

  /* 商品所属商户数据初始化 */
  getMerData = () => {
    const { dispatch, detailData } = this.props;
    let queryParam = {
      id: detailData ? detailData.id : ''
    }

    let rowIdArr = []
    if (detailData) {
      detailData.children.map((item) => {
        rowIdArr.push(item.key)
      })
    }

    dispatch({
      type: `${namespace}/queryAllMer`,
      payload: queryParam
    }).then(()=>{
     let tableData = this.props.merData.map((item) => {
        const {
          merMapId,
          merMapName,
          sellPrice,
        } = item

        return {
          key: detailData ? detailData.id.toString()+merMapId.toString() : merMapId,
          merMapId,
          merMapName,
          sellPrice: sellPrice ? covertMoney2Yuan(sellPrice) : 0.00,
        }
      })
      this.setState({
        dataSource: tableData,
        selectedRows: detailData ? detailData.children :[],
        selectedRowKeys: detailData ? rowIdArr :[],
      })
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const {selectedRows, imgPath} = this.state
      const tableData = selectedRows.map((item) => {
        return {merMapId: item.merMapId, sellPrice: covertMoney(item.sellPrice, false)}
      })
      const values = {
        ...fieldsValue,
        spuImgUrl: imgPath,
        shopitemList: tableData
      };
      
      dispatch({
        type: detailData ? `${namespace}/update` : `${namespace}/add`,
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  }

  handleSave = (row) => {
    // 修改表数据
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });

    //修改选中的数据
    const newRowsData = [...this.state.selectedRows];
    const rowIndex = newRowsData.findIndex(item => row.key === item.key);
    
    let rowItem = '', changeIndex = '';
    if (rowIndex == -1) {
      let {selectedRowKeys} = this.state
      selectedRowKeys.push(row.key)
      
      this.setState({
        selectedRowKeys
      })
      rowItem = row
      changeIndex = index
    }else{
      rowItem = newRowsData[rowIndex]
      changeIndex = rowIndex
    }
    newRowsData.splice(changeIndex, 1, {
      ...rowItem,
      ...row,
    });
    
    this.setState({ dataSource: newData, selectedRows: newRowsData });
  }

  onChange (val) {
    this.setState({
      imgPath: val
    })
  }

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    const { loading } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }

    const rowSelection = {
      selectedRowKeys,
      // getCheckboxProps:record=>({
      //   defaultChecked: record.key
      // }),
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.editFormItem}>
        <Form layout='vertical' onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='类型编号'>
                {getFieldDecorator('id', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.id : ''}))
                (<Input placeholder='请输入类型编号' disabled={detailData ? true : false}/>)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label='类型名称'>
                {getFieldDecorator('spuName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.spuName : ''}))
                (<Input placeholder='请输入类型名称' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <FormItem label='商品条码'>
                {getFieldDecorator('spuBarcode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.spuBarcode : ''}))
                (<Input placeholder='请输入商品条码' />)}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label='单位'>
                {getFieldDecorator('spuUnitName', Object.assign({}, {}, {initialValue: detailData ? detailData.spuUnitName : ''}))
                (<Input placeholder='请输入商品单位' />)}
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem label='规格'>
                {getFieldDecorator('spuSpec', Object.assign({}, {}, {initialValue: detailData ? detailData.spuSpec : ''}))
                (<Input placeholder='请输入商品规格' />)}
              </FormItem>
            </Col>
          </Row>
          
          <Divider /> 
          
          <Row>
            <Col span={16}>
              <Table
                components={components}
                bordered
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                size='small'
                rowSelection={rowSelection}
                pagination={false}
              />
            </Col>
            <Col span={8}>
              <UploadImg onChange={(val) => {this.onChange(val)}} imgPath={detailData.spuImgUrl} defaultFlag='item' />
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
            <Button onClick={this.onClose} type='primary' htmlType='submit'>保存</Button>
          </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage