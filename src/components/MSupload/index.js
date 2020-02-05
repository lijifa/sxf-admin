import React, { Component, Fragment } from 'react';
import { Upload, Button } from 'antd';
import styles from './index.less';
import itemImg from '@/assets/img_4.png';
import xCookie from '@/utils/xCookie'
//获取授权Cookie
const authCookie = xCookie.get('authentication') ? xCookie.get('authentication') : ''
export default class MSupload extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        avatar: this.props.imgPath ? this.props.imgPath : itemImg,
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.imgPath != this.props.imgPath) {
            this.setState({
                avatar: nextProps.imgPath
            })
        }
    }

    onChange (e) {
        let res = e.file
        if (res.status == 'done' && res.response.code=='00') {
            let src = res.response.data.src
            this.setState({
                //avatar: UPLOAD_URL+src
                avatar: src
            }, ()=>{
                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(src)
                }
            })
        }
    }
    // 设置默认头像
    defaultErrorAvatar () {
        this.setState({
            avatar: itemImg
        })
    }

    // 头像组件 方便以后独立，增加裁剪之类的功能
    render() {
        const { avatar } = this.state;
        
        return (
            <Fragment>
                <Upload
                    action ='/tkc/upload/img'
                    onChange={(e)=>this.onChange(e)}
                    showUploadList={false}
                    headers={
                        {'authentication-info': authCookie}
                    }
                >
                    <div className={styles.avatar}>
                        <img style={{width:'100%'}} src={avatar} onError={()=>this.defaultErrorAvatar()} alt="avatar" />
                    </div>
                </Upload>
            </Fragment>
        );
    }
}