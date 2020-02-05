import { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio } from 'antd';
import {responseMsg, changeTime} from '@/utils/utils';
import RegionSelect from '@/components/TKRegionSelect';
import styles from './styles.less';
const FormItem = Form.Item;

const namespace = 'city';
const mapStateToProps = (state) => {
  const result = state[namespace].editRes;
  return {
    result
  };
};
@connect(mapStateToProps)

class EditPage extends Component {
  state = {
    flag: '0'
  };
  componentDidMount() {
    const {detailData} = this.props
    if (detailData) {
      this.setState({
        flag: this.whichOne()
      })
    }
  }
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form, detailData, onReturnList } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { 
        regionId,
        cityId,
        cityCounty,
        cityName,
        cityProvName,
        cityTel,
        cityZip,
      } = fieldsValue
      const values = {
        id: detailData ? detailData.id : '',
        regionId,
        cityId,
        cityCounty,
        cityName,
        cityProvName,
        cityTel,
        cityZip,
        cityCcode: cityId,
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

  changeFlag (e) {
    this.setState({
      flag: e.target.value
    })
  }

  whichOne = () => {
    const { detailData } = this.props;
    let flag = '0'
    if (!detailData) {
      return flag
    }
    if (detailData.cityProvName && detailData.cityProvName != '-') {
      flag = '0'
    }

    if (detailData.cityProvName && detailData.cityName && detailData.cityProvName != '-' && detailData.cityName != '-') {
      flag = '1'
    }

    if (detailData.cityProvName && detailData.cityName && detailData.cityCounty && detailData.cityProvName != '-' && detailData.cityName != '-' && detailData.cityCounty != '-') {
      flag = '2'
    }
    return flag
  }

  render() {
    const { detailData } = this.props;
    const { flag } = this.state;
    const { getFieldDecorator } = this.props.form;
    const decoratorConfig = {
      rules: [{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }
    const matchingNumber = {
      rules: [{pattern: /^[0-9]*$/, message: formatMessage({ id: 'global.tips.onlynum' })},{ required: true, message: formatMessage({ id: 'global.tips.notnull' }) }]
    }

    const pleaseText = formatMessage({ id: 'global.input.please' })
    return (
      <div className={styles.editFormItem}>
          <Form layout='vertical' onSubmit={this.handleSubmit}>

            <FormItem label={formatMessage({ id: 'city.cityFlag' })}>
              {getFieldDecorator('flag', Object.assign({}, decoratorConfig, {initialValue: flag}))
              (
                <Radio.Group buttonStyle="solid" onChange={(value) => this.changeFlag(value)}>
                  <Radio.Button value="0">{formatMessage({ id: 'city.cityProvName' })}</Radio.Button>
                  <Radio.Button value="1">{formatMessage({ id: 'city.cityName' })}</Radio.Button>
                  <Radio.Button value="2">{formatMessage({ id: 'city.cityCounty' })}</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.regionId' })}>
              {getFieldDecorator('regionId', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.regionId : 156}))
              (
                <RegionSelect placeholder={pleaseText + formatMessage({ id: 'city.regionId' })} />
              )}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityProvName' })} style={{display: flag=='0' ? 'block' : 'none'}}>
              {getFieldDecorator('cityProvName', Object.assign({}, flag=='0' ? decoratorConfig : {}, {initialValue: detailData ? detailData.cityProvName : '-'}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityProvName' })} />)}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityName' })} style={{display: flag=='1' ? 'block' : 'none'}}>
              {getFieldDecorator('cityName', Object.assign({}, flag=='1' ? decoratorConfig : {}, {initialValue: detailData ? detailData.cityName : '-'}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityName' })} />)}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityCounty' })} style={{display: flag=='2' ? 'block' : 'none'}}>
              {getFieldDecorator('cityCounty', Object.assign({}, flag=='2' ? decoratorConfig : {}, {initialValue: detailData ? detailData.cityCounty : '-'}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityCounty' })} />)}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityId' })}>
              {getFieldDecorator('cityId', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.cityId : ''}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityId' })} maxLength={6} />)}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityTel' })}>
              {getFieldDecorator('cityTel', Object.assign({}, decoratorConfig, {initialValue: detailData ? detailData.cityTel : ''}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityTel' })} />)}
            </FormItem>

            <FormItem className='inputW210' label={formatMessage({ id: 'city.cityZip' })}>
              {getFieldDecorator('cityZip', Object.assign({}, matchingNumber, {initialValue: detailData ? detailData.cityZip : ''}))
              (<Input placeholder={pleaseText + formatMessage({ id: 'city.cityZip' })} maxLength={6}/>)}
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
                {formatMessage({ id: 'global.button.cancel' })}
              </Button>
              <Button type="primary" htmlType="submit">{formatMessage({ id: 'global.button.ok' })}</Button>
            </div>
        </Form>
      </div>
    );
  }
}

const EditFormPage = Form.create()(EditPage);
export default EditFormPage