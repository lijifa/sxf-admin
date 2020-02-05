import React from 'react';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import Context from './MenuContext';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

export default class CashierLayout extends React.Component {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
  }

  state = {
    rendering: true,
    isMobile: false,
  };

  componentDidMount() {
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getPageTitle = pathname => {
    let currRouterData = null;

    if (!currRouterData) {
      return '中国民生银行';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - 中国民生银行`;
  };

  render() {
    const {
      children,
      location: { pathname },
    } = this.props;
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)} style={{background:'#001529'}}>
                {children}
                </div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}