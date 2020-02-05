import { Component } from "react";
import styles from './styles.less';
import { getObjStatus } from '@/utils/utils';

const mdrTypeSelect = [
    {key: '0', value: '总扣率'},
    {key: '1', value: '分项扣率'},
    {key: '9', value: '不计扣率'}
]
export default class DetailPage extends Component {
    
    render(){
        const {detailData} = this.props
        return(
            <div>
                <table className={styles.detailTable}>
                    <tbody>
                        <tr>
                            <th>
                                支付方式
                            </th>
                            <td>
                                {detailData.paytypeName}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                支付ID
                            </th>
                            <td>
                                {detailData.paytypeId}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                支付代码
                            </th>
                            <td>
                                {detailData.paytypeCode}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                语言语种
                            </th>
                            <td>
                                {detailData.langCode}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                手续费计算标志
                            </th>
                            <td>
                                {getObjStatus(mdrTypeSelect, detailData.mdrType)}
                            </td>
                        </tr>

                        <tr>
                            <th>
                                图标
                            </th>
                            <td>
                                <img style={{width: '100px'}} src={detailData.paytypeIcon} />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                备注
                            </th>
                            <td>
                                {detailData.dataReserve}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}