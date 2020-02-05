import { Component } from "react";
import { Row, Col, Table } from 'antd';
import styles from './styles.less';

export default class DetailPage extends Component {
    
    render(){
       // const {detailData} = this.props
        return(
            <div>
                <h3 className={styles.h3Title}>基本信息</h3>
                <table className={styles.detailTable}>
                    <tbody>
                        <tr>
                            <th>
                                员工号
                            </th>
                            <td>
                                1001
                            </td>
                            <th>
                                员工姓名
                            </th>
                            <td>
                                宋江
                            </td>
                            <td rowSpan='3' >
                                <div className={styles.photo}>
                                 照片
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>
                                员工状态
                            </th>
                            <td>
                                在职
                            </td>
                            <th>
                                员工手机
                            </th>
                            <td>
                                18010101118
                            </td>
                        </tr>
                        <tr>
                            <th>
                                员工职位
                            </th>
                            <td>
                                主管
                            </td>
                            <th>
                                员工座机
                            </th>
                            <td>
                                010-29938822
                            </td>
                        </tr>
                        <tr>
                            <th>
                                入职日期
                            </th>
                            <td>
                                2018-09-08
                            </td>
                            <th>
                                电子邮箱
                            </th>
                            <td colSpan='2'>
                                18010101118@qq.com
                            </td>
                        </tr>

                        <tr>
                            <th>
                                所属部门
                            </th>
                            <td colSpan='4'>
                                信息部
                            </td>
                        </tr>

                        <tr>
                            <th>
                                代理领导
                            </th>
                            <td colSpan='4'>
                                张海洋，李丽，张明宇
                            </td>
                        </tr>

                        <tr>
                            <th>
                                备注
                            </th>
                            <td colSpan='4'>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>

                <h3 className={styles.h3Title} style={{ margin: '10px 0' }}>账户信息</h3>
                <table className={styles.detailTable2}>
                    <tbody>
                        <tr>
                            <th>
                                洗衣账户余额
                            </th>
                            <td>
                                9863.00
                            </td>
                        </tr>
                        <tr>
                            <th>
                                累计充值总额
                            </th>
                            <td>
                                6800.00
                            </td>
                        </tr>
                        <tr>
                            <th>
                                累计消费总额
                            </th>
                            <td>
                                1230.00
                            </td>
                        </tr>
                        <tr>
                            <th>
                                累计就餐次数
                            </th>
                            <td>
                                188
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}