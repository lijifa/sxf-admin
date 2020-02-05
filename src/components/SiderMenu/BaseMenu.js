import React, { Component, PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && (icon.indexOf('http') === 0 || icon.indexOf('https') === 0)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

const switchIcon = (iconType, active=false) => {
  let iconPath =  '/icon/icon_01_01.png'
  let iconPathActive =  '/icon/icon_01_02.png'
  switch (iconType) {
    case '/home':
      iconPath = '/icon/icon_01_01.png'
      iconPathActive = '/icon/icon_01_02.png'
      break;
    
    case '/system':
      iconPath = '/icon/icon_02_01.png'
      iconPathActive = '/icon/icon_02_02.png'
      break;

    case '/archives':
      iconPath = '/icon/icon_03_01.png'
      iconPathActive = '/icon/icon_03_02.png'
      break;

    case '/goods':
      iconPath = '/icon/icon_04_01.png'
      iconPathActive = '/icon/icon_04_02.png'
      break;

    case '/trade':
      iconPath = '/icon/icon_05_01.png'
      iconPathActive = '/icon/icon_05_02.png'
      break;
    case '/sale':
      iconPath = '/icon/icon_06_01.png'
      iconPathActive = '/icon/icon_06_02.png'
      break;
    case '/mall':
      iconPath = '/icon/icon_07_01.png'
      iconPathActive = '/icon/icon_07_02.png'
      break;
    case '/settle':
      iconPath = '/icon/icon_08_01.png'
      iconPathActive = '/icon/icon_08_02.png'
      break;
    case '/total':
      iconPath = '/icon/icon_09_01.png'
      iconPathActive = '/icon/icon_09_02.png'
      break;
  }
  if (active) {
    return <img style={{width: '24px'}} src={iconPathActive} alt="icon" />
  }else{
    return <img style={{width: '24px'}} src={iconPath} alt="icon" />
  }
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => item && pathToRegexp(item).test(path));

export default class BaseMenu extends Component {
  state = {
    menuChildData: '',
    menuClickItem: '/home'
  };

  constructor(props) {
    super(props);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  componentDidMount(){
    let menukeys = this.getSelectedMenuKeys()
    this.setState({
      menuClickItem: menukeys[0]
    })
    this.changeMenuTab(menukeys[0])
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const name = formatMessage({ id: item.locale });
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span icon={item.icon}>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
          icon={item.icon}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const name = formatMessage({ id: item.locale });
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span style={{fontSize: '12px'}}>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span style={{fontSize: '12px'}}>{name}</span>
      </Link>
    );
  };

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && (path.indexOf('http') === 0 || path.indexOf('https') === 0)) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  //菜单一级
  getMenuLv1() {
    const { menuClickItem } = this.state
    const { menuData } = this.props;
    let menulv1Data = this.getNavMenuItems(menuData)
    let menuLv1 = []
    menulv1Data.map((item, key) => {
      if (item.constructor == Array) {
        return;
      }
      let repStr = item.key.replace(/\//g,"menu.");
      let name = formatMessage({ id: repStr });
      menuLv1.push(
        <div key={key} className={menuClickItem == item.key ? styles.menuLv1ClickStyle : styles.menuLv1Style} onClick={() => this.changeMenuTab(item.key)}>
          {switchIcon(item.key, menuClickItem == item.key)}
          <p style={{fontSize: '12px', fontWeight: 'bold'}}>{name}</p>
        </div>
      )
    })

    return <div className={styles.leftMenu} >{menuLv1}</div>
  }

  changeMenuTab (key) {
    const { menuData } = this.props
    let  childMenuData = []
    menuData.map((item) => {
      if (item.path == key && item.children) {
        childMenuData = item.children
      }
    })

    this.setState({
      menuChildData: childMenuData,
      menuClickItem: key
    })
  }

  //菜单子级
  getMenuChildren(){
    const { menuChildData } = this.state
    if (!menuChildData) {
      return;
    }
    const { openKeys, theme, mode } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    
    const { handleOpenChange, style } = this.props;
      return <Menu
        key="Menu"
        inlineIndent={14}
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        style={style}
        {...props}
      >
        {this.getNavMenuItems(menuChildData)}
      </Menu>
  }

  render() {
    return (
      <div>
        {this.getMenuLv1()}
        {this.getMenuChildren()}
      </div>
    );
  }
}
