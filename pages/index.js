import React from "react";

import { motion } from "framer-motion";

import styles from "../styles/Home.module.css";

export default function Home() {
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>
					Chào mừng đến với{" "}
					<span className={styles.headername}>WANXA</span>
				</h1>
			</div>
			<div className={styles.select}>
				<Option
					title="Giới thiệu ứng dụng"
					image="/picture/introduce.jpg"
					url="./#introduce"
				/>
				<Option
					title="Khởi đầu chỉ với 3 bước"
					image="/picture/getting-started.jpg"
					url="./#getting-started"
				/>
			</div>
			<Space1 />
			<Space2 />
		</div>
	);
}

function Option({ title, image, url }) {
	const [hover, setHover] = React.useState(false);

	const variants = {
		show: {
			opacity: 1,
			y: 0,
		},
		hide: {
			opacity: 0,
			y: 500,
		},
	};
	return (
		<a
			href={url}
			onMouseEnter={() => {
				setHover(true);
			}}
			onMouseLeave={() => {
				setHover(false);
			}}
			className={styles.optionItem}
		>
			<img className={styles.optionImage} src={image} />
			<motion.div
				transition={{ type: "spring", damping: 20 }}
				variants={variants}
				animate={hover ? "show" : "hide"}
				initial={!hover ? "show" : "hide"}
				className={styles.optionTitle}
			>
				<h3>{title}</h3>
			</motion.div>
		</a>
	);
}

function Space1() {
	return (
		<div id="introduce" className={styles.space}>
			<h1 className={styles.spaceTitle}>Giới thiệu về ứng dụng</h1>
		</div>
	);
}
function Space2() {
	return (
		<div id="getting-started" className={styles.space}>
			<h1 className={styles.spaceTitle}>Bắt đầu thôi nào !</h1>
			<p className={styles.spaceSubTitle}>
				Bắt đầu xây dựng một doanh nghiệp cực kỳ đơn giản chỉ 3 bước
			</p>
			<div className={styles.timelineContainer}>
				<TimeLine />
			</div>
		</div>
	);
}

function TimeLine() {
	const data = [
		{ title: "Đăng ký tài khoản cá nhân", picture: "" },
		{ title: "Tạo một cửa hàng mới", picture: "" },
		{ title: "Tạo menu", picture: "" },
		{ title: "Tạo cơ sở vật chất", picture: "" },
		{ title: "Thêm nhân viên", picture: "" },
		{ title: "Khởi động cửa hàng của bạn thôi nào", picture: "" },
	];
	return (
		<div className={styles.timeline}>
			<div className={styles.timedata}>
				{data.map(
					(item, index) =>
						index % 2 == 0 ? <TimeLineItem position="left" item={item} /> : <TimeLineItem position="right" item={item} />
				)}
			</div>
			<div className={styles.timeMid} />
		</div>
	);
}

function TimeLineItem({item,position}){
  const {title,picture} = item;
  return(
    <div className={styles.timelineItem+" "+styles[position]}>
        <h3>{title}</h3>
    </div>
  )
}