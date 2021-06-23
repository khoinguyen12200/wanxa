import React from "react";
import Link from "next/link";
import {
	motion,
	useViewportScroll,
	useTransform,
	AnimateSharedLayout,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaCashRegister } from "react-icons/fa";
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
					image="/picture/introduce.svg"
					url="./#introduce"
				/>
				<Option
					title="Khởi đầu chỉ với 6 bước"
					image="/picture/rocket.svg"
					url="./#getting-started"
				/>
				<Option
					title="Đăng nhập"
					image="/picture/sign-in.svg"
					url="/account/sign-in"
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
				animate={!hover ? "show" : "hide"}
				initial={hover ? "show" : "hide"}
				className={styles.optionTitle}
			>
				<h3>{title}</h3>
			</motion.div>
		</a>
	);
}

function Space1() {
	const sentences = [
		{
			title: "Giải pháp quản lý công việc và lưu trữ hóa đơn",
			subTitle:
				"Giúp các bạn giải quyết bài toán quản lý doanh nghiệp, nhân viên, chức vụ, và nhiều hơn thế nữa",
			picture: "/picture/application.svg",
		},
		{
			title: "Chức năng về cơ sở vật chất và menu",
			subTitle:
				"Dễ dàng tạo, chỉnh sửa,nhóm các cơ sở vật chất trong quán của bạn cũng như hệ thống menu",
			picture: "/picture/shoping.svg",
		},
		{
			title: "Phân quyền các thành viên trong quán",
			subTitle:
				"Bạn có thể tự ra một không gian làm việc an toàn và hiệu suất cao",
			picture: "/picture/staff-privileges.svg",
		},
		{
			title: "Thông báo - Thống kê - Lịch sử hóa đơn",
			subTitle: "Đầy đủ các chức năng dành cho người quản lý",
			picture: "/picture/manager.svg",
		},
		{
			title: "Làm việc và giao tiếp thời gian thực",
			subTitle:
				"Hệ thống làm việc, chat Realtime kết nối mọi tác vụ cho công việc kinh doanh",
			picture: "/picture/teamwork.svg",
		},
	];
	return (
		<div id="introduce" className={styles.space}>
			<h1 className={styles.spaceTitle}>Giới thiệu về ứng dụng</h1>
			<div style={{ paddingTop: 30 }}>
				{sentences.map((sentence, index) => (
					<Sentence
						sentence={sentence}
						key={index}
						type={index % 2 != 0}
					/>
				))}
			</div>
		</div>
	);
}
function Sentence({ sentence, type }) {
	const { title, subTitle, picture } = sentence;
	const [ref, inView, entry] = useInView({
		threshold: 0.3,
		triggerOnce: true,
	});
	const variants = {
		show: {
			opacity: 1,
			y: 0,
			transition: { type: "spring", damping: 20 },
		},
		hide: {
			opacity: 0,
			y: 400,
		},
	};
	const pictureAnimation = {
		first: {
			scale: 0,
		},
		second: {
			scale: 1,
			transition: { type: "spring", damping: 20 },
		},
	};
	return (
		<div ref={ref} className={styles.sentence}>
			<div
				className={type ? styles.sentenceEmpty1 : styles.sentenceEmpty2}
			/>
			<div className={styles.sentencePicContainer}>
				<motion.img
					variants={pictureAnimation}
					animate={inView ? "second" : "first"}
					initial={!inView ? "second" : "first"}
					className={styles.sentencePic}
					src={picture}
				/>
			</div>
			<motion.div
				variants={variants}
				animate={inView ? "show" : "hide"}
				initial={!inView ? "show" : "hide"}
				className={
					(type ? styles.sentenceSpace1 : styles.sentenceSpace2) +
					" " +
					styles.sentenceSpace
				}
			>
				<h1>{title}</h1>
				<h5>{subTitle}</h5>
			</motion.div>
		</div>
	);
}
function Space2() {
	return (
		<div id="getting-started" className={styles.space}>
			<h1 className={styles.spaceTitle}>
				Làm thế nào để tạo một doanh nghiệp ?
			</h1>
			<p className={styles.spaceSubTitle}>
				Bắt đầu xây dựng một doanh nghiệp cực kỳ đơn giản chỉ với 6 bước
			</p>
			<div className={styles.timelineContainer}>
				<TimeLine />
			</div>
			<div className={styles.Space2ButtonContainer}>
				<button className="btn btn-dark btn-lg">
					Bắt đầu thực hiện
				</button>
			</div>
		</div>
	);
}

function TimeLine() {
	const data = [
		{ title: "Đăng ký tài khoản cá nhân", picture: "/picture/sign-up.jpg" },
		{ title: "Tạo một cửa hàng mới", picture: "/picture/store.svg" },
		{ title: "Tạo menu", picture: "/picture/menu.jpg" },
		{ title: "Tạo cơ sở vật chất", picture: "/picture/facility.jpg" },
		{ title: "Thêm nhân viên", picture: "/picture/staff.svg" },
		{
			title: "Khởi động cửa hàng của bạn thôi nào",
			picture: "/picture/start.svg",
		},
	];
	return (
		<div className={styles.timeline}>
			<div className={styles.timedata}>
				{data.map((item, index) =>
					index % 2 == 0 ? (
						<TimeLineItem position="left" item={item} />
					) : (
						<TimeLineItem position="right" item={item} />
					)
				)}
			</div>
			<div className={styles.timeMid} />
		</div>
	);
}

function TimeLineItem({ item, position }) {
	const [ref, inView, entry] = useInView({
		threshold: 1,
		triggerOnce: true,
	});

	const { title, picture, link } = item;
	const variants = {
		show: {
			opacity: 1,
			scale: 1,
			x: 0,
		},
		hide: {
			opacity: 0,
			scale: 0,
			x: position == "left" ? 500 : -500,
		},
	};
	return (
		<div ref={ref} className={styles.timelineItem + " " + styles[position]}>
			<motion.div
				variants={variants}
				animate={inView ? "show" : "hide"}
				initiual="hide"
				transition={{ type: "spring", damping: 20 }}
				className={styles.itemBox}
			>
				<h3 className={styles.itemTitle}>{title}</h3>

				<img className={styles.itemPicture} src={picture} />
			</motion.div>
			<div className={styles.icon} />
		</div>
	);
}
