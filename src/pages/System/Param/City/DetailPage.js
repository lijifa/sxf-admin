import { Component } from "react";
import { formatMessage } from 'umi/locale';
import { Row, Col, Table } from 'antd';
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
                                {formatMessage({ id: 'city.cityId' })}
                            </th>
                            <td>
                                {detailData.cityId}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {formatMessage({ id: 'city.cityFlag' })}
                            </th>
                            <td>
                                {detailData.cityProvName+' - '+ detailData.cityName +' - '+ detailData.cityCounty}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {formatMessage({ id: 'city.cityTel' })}
                            </th>
                            <td>
                                {detailData.cityTel}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                {formatMessage({ id: 'city.cityZip' })}
                            </th>
                            <td>
                                {detailData.cityZip}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}