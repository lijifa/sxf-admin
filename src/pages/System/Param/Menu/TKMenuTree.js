import React, { Component } from 'react'
import { connect } from 'dva';
import { TreeSelect } from 'antd'
//import findIndex from 'lodash/findIndex';
const { TreeNode } = TreeSelect;
const namespace = 'menu';

@connect(({ menu, loading }) => ({
  result: menu.selectData,
  loading: loading.effects['menu/queryAll'] ? true : false,
}))

export default class LazyOptions extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.queryMenu()
  }

  // 获取菜单全部数据
  queryMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/queryAll`,
      payload: {}
    });
  }

  //获取菜单树结构
  renderTreeNodes = (data) => {
    if (!data) {
      return
    }
    return data.map((item) => {
      //const isLeaf = false
      if (item.accessList) {
        return (
          <TreeNode value={item.menuId.toString()} title={item.menuName} key={item.menuId} dataRef={item}>
            {this.renderTreeNodes(item.accessList)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.menuId.toString()} title={item.menuName} key={item.menuId} dataRef={item} />;
    });
  }

  onChange = value => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value) 
    }
  };

  render() {
    const { result, defaultValue } = this.props
    let menuData = result ? result.data.accessList : ''

    let decoratorData = this.props['data-__meta']
    return (
      <TreeSelect
        showSearch
        //value={this.state.value}
        defaultValue={ decoratorData ? decoratorData.initialValue : defaultValue }
        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        placeholder="请选择父级菜单"
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
      >
        {this.renderTreeNodes(menuData)}
      </TreeSelect>
    );
  }
}