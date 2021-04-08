import React from 'react'
import styles from '../../../styles/internal-information.module.css';
import NavBar from "../../../components/StoreNavBar";

export default function internalInformation() {
    return (
        <div className={styles.page}>
            <NavBar/>
            <h3 className={styles.title}>Thông báo nội bộ</h3>
            <div className={styles.listInterNoti}>
                
            </div>
        </div>
    )
}
