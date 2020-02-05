import { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Tree } from 'antd';
import { responseMsg, getRoleMenuId } from '@/utils/utils';

import styles from './styles.less';
const TreeNode = Tree.TreeNode;
const namespace = 'menu';
const mapStateToProps = (state) => {
  const result = state[namespace].selectData;
  //const selectedMenuData = state[namespace].queryListByRole;
  return {
    result,
  };
};
@connect(mapStateToProps)

class SetPage extends Component {
  state = {
    checkedKeys: [],
  };
  onCheck = (checkedKeys, info) => {
    //获取选中的子节点和半选的父节点
    let allCheckedKeys = [...checkedKeys, ...info.halfCheckedKeys]
    this.setState({
      checkedKeys: allCheckedKeys,
    })
  }

  componentDidMount() {
    //this.getSelectedMenuList()
    this.getAllMenuList()
  }

  /* 查询全部模块列表 */
  getAllMenuList() {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  // /* 查询选中列表 */
  // getSelectedMenuList() {
  //   const { dispatch, detailData } = this.props;
  //   let queryParam = {
  //     roleId: detailData ? detailData.roleId : ''
  //   }
  //   dispatch({
  //     type: `${namespace}/queryByRole`,
  //     payload: queryParam
  //   });
  // }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      //const isLeaf = false
      if (item.accessList) {
        return (
          <TreeNode title={item.menuName} key={item.menuId} dataRef={item}>
            {this.renderTreeNodes(item.accessList)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.menuName} key={item.menuId} dataRef={item} />;
    });
  }

  //提交修改
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err) => {
      if (err) return;

      //为了去除根节点，先拷贝数组
      let menuIds = new Array(this.state.checkedKeys.length)
      for (let i=0;i<menuIds.length;i++)
      {
        menuIds[i] = this.state.checkedKeys[i]
      }

      //去除为0的根节点
      var index = menuIds.indexOf("0");
      if (index > -1) {
        menuIds.splice(index, 1);
      }

      const values = {
        roleMapId: detailData ? detailData.roleMapId : '',
        menuIds: menuIds,
      };
      
      //设置权限
      dispatch({
        type: `role/updateAccess`,
        payload: values,
        callback: (res) => {
          if (res) {
            if (res.code == '00') {
              responseMsg(res)
              onReturnList()
            } else {
              responseMsg(res)
            }
          }
        }
      });
    });
  };

  render() {
    const { result, detailData } = this.props

    let menuData = result ? result.data.accessList : []
    if (menuData === undefined || menuData.length == 0) {
      menuData = []
    }

    let selectedKey = []
    if (typeof (detailData.menuIds) != 'undefined') {
      //为了过滤父节点，先拷贝数组
      // let parent = new Array(menuData.length)
      // {
      //   for (let i = 0; i < parent.length; i++) {
      //     parent[i] = menuData[i].menuId
      //   }
      // }
      let parentIds = getRoleMenuId(menuData)
      
      for (let i = 0; i < detailData.menuIds.length; i++) {
        //为了避免选择父节点后子节点会被全选的问题，过滤掉父节点
        if (parentIds.indexOf(detailData.menuIds[i]) == -1) {
          selectedKey.push(detailData.menuIds[i].toString())
        }
      }
    }
    
    if (menuData.length > 0) {//待menu载入完成后再进行初始化
      return (
        <div className={styles.setFormItem}>
          <Tree
            checkable
            showLine
            defaultExpandAll
            //loadData={this.searchMenuList}
            // defaultExpandedKeys={['0-0-0', '0-0-1']}
            //defaultSelectedKeys={['45', '46']}
            //checkedKeys={selectedKey}
            defaultCheckedKeys={selectedKey}
            // onSelect={this.onSelect}
            onCheck={this.onCheck}
          >
            <TreeNode title={'★' + '所有模块'} key="0">
              {this.renderTreeNodes(menuData)});
            </TreeNode>
          </Tree>

          <Form layout='vertical' onSubmit={this.handleSubmit}>

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
    else {
      return (<div></div>
      );
    }
  }
}

const SetFormPage = Form.create()(SetPage);
export default SetFormPage