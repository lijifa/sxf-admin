import { Component } from "react";
import { formatMessage } from 'umi/locale';
import styles from './styles.less';

export default class DetailPage extends Component {
    
    render(){
        const {detailData} = this.props
        return(
            <div>
                <table className={styles.detailTable}>
                    <tbody>
                        <tr>
                            <th>
                                {formatMessage({ id: 'mcc.mccId' })}
                            </th>
                            <td>
                                {detailData.mccId}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {formatMessage({ id: 'mcc.langCode' })}
                            </th>
                            <td>
                                {detailData.langCode}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {formatMessage({ id: 'mcc.mccName' })}
                            </th>
                            <td>
                                {detailData.mccName}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}