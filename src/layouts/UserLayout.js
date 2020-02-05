import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    唐库 2019 Bate1.20190801.19
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    const ScreenHeight = document.body.clientHeight;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content} style={{ paddingTop:(ScreenHeight - 350)/2 }}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>欢迎登录</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
