import React from "react";
import styles from "./styles/pages-styles.module.css";

export function CanNotAccess() {
	return (
		<div className={styles.CanNotAccess}>
			<div className={styles.content}>
				<img src="/icons/stop.svg" />
				<h3>Bạn không có quyền truy cập vào đường dẫn này</h3>
			</div>
		</div>
	);
}

export function Loading() {
	return (
		<div className={styles.Loading}>
			<div className={styles.content}>
				<h3>Đang tải</h3>
			</div>
		</div>
	);
}
