import React, { Component } from 'react';
import { Button } from 'antd';
import ReactDOM from 'react-dom';

export default class MSDownloadFile extends Component {
    constructor(props) {
        super(props);
    }

    handleExport = e => {
        const { action, queryParam } = this.props;
        var params = JSON.stringify(queryParam);
        var downloadUrl = UPLOAD_URL + '/cmbc/' + action;
        var divElement = document.getElementById("downloadDiv");
        
        ReactDOM.render(
            <form action={downloadUrl} method="get">
                <input name="context" type="text" value={params} />
            </form>,
            divElement
        )

        var params = JSON.stringify(queryParam)
        ReactDOM.findDOMNode(divElement).querySelector('form').submit();
        ReactDOM.unmountComponentAtNode(divElement);
    };

    // 头像组件 方便以后独立，增加裁剪之类的功能
    render() {
        return (
            <div>
                <div id='downloadDiv' style={{ display: 'none' }}>
                </div>
                <Button onClick={() => { this.handleExport() }}>导出</Button>
            </div>
        );
    }
}