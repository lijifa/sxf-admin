import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import StatusSelect from '@/components/MsStatusSelect';
import LangSelect from '@/components/TKLangSelect';
import MenuTree from './TKMenuTree';
import styles from './styles.less';
const FormItem = Form.Item;
const namespace = 'menu';
const menuLevelSelect = [
  {key: 1, value: '一级菜单'},
  {key: 2, value: '二级菜单'},
  {key: 3, value: '三级菜单'},
  {key: 4, value: '按钮'},
  {key: 9, value: '操作'}
]
const flagStatusSelect = [
  {key: 0, value: '正常'},
  {key: 1, value: '暂停'}
]
@connect(({ menu }) => ({
  result: menu.editRes
}))

class EditPage extends Component {
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { 
        langCode,
        menuPid,
        menuName,
        menuLevel,
        menuDir,
        menuMethod,
        //flagStatus,
        dataReserve,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        langCode,
        menuPid: menuPid ? menuPid : 0,
        menuName,
        menuLevel,
        menuDir,
        menuMethod,
        flagStatus: 0,
        dataReserve,
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
  
  render() {
    const { detailData } = this.props;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: '此项必填' }]
    }
    return (
      <div className={styles.editFormItem}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>
{/*             
            <FormItem label='菜单ID'>
              {getFieldDecorator('menuId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.menuId : ''}))
              (<Input placeholder='在这里添加菜单ID' maxLength='3'/>)}
            </FormItem> */}

            <FormItem label='菜单名称'>
              {getFieldDecorator('menuName', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.menuName : ''}))
              (<Input placeholder='在这里添加菜单名称' />)}
            </FormItem>

            <FormItem label='父级菜单'>
              {getFieldDecorator('menuPid', Object.assign({}, {}, {initialValue: detailData ? detailData.menuPid.toString() : ''}))
              (<MenuTree placeholder='在这里添加父级菜单' />)}
            </FormItem>
            
            <FormItem label='菜单级别'>
              {getFieldDecorator('menuLevel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.menuLevel : 1}))
              ( <StatusSelect options={menuLevelSelect} placeholder='在这里选择菜单级别' />)}
            </FormItem>

            <FormItem label='语言语种'>
              {getFieldDecorator('langCode', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.langCode : 'zh_CN'}))
              (<LangSelect placeholder='在这里选择语言语种' />)}
            </FormItem>

            <FormItem label='节点位置'>
              {getFieldDecorator('menuDir', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.menuDir : ''}))
              (<Input placeholder='在这里添加节点位置' />)}
            </FormItem>      

            <FormItem label='调用方法'>
              {getFieldDecorator('menuMethod', Object.assign({}, {}, {initialValue: detailData ? detailData.menuMethod : ''}))
              (<Input placeholder='在这里添加调用方法' />)}
            </FormItem>

            <FormItem label='备注'>
              {getFieldDecorator('dataReserve', Object.assign({}, {}, {initialValue: detailData ? detailData.dataReserve : ''}))
              (<Input.TextArea rows={4} placeholder='在这里添加备注' />)}
            </FormItem>

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
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage