import React from "react";
import { motion } from "framer-motion";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import Link from "next/link";
import { signInValidate } from "../components/Validations";
import { isMobile } from "../components/Const";
import Image from "next/image";
import styles from "../styles/SignIn.module.css";

export default function SignIn({}) {
	return (
		<div className={styles.main}>
			<div className={styles.form}>
				<MyForm />
			</div>
			{!isMobile() && (
				<div className={styles.banner}>
					<img
						layout="fill"
						className={styles.store}
						src="/icons/shops.svg"
					/>
					<motion.img
						initial={{ y: 0 }}
						animate={{ y: 100 }}
						transition={{
							type: "spring",
							damping: 30,
							repeat: Infinity,
							repeatType: "reverse",
						}}
						className={styles.team}
						src="/icons/teamwork.svg"
					/>
				</div>
			)}
		</div>
	);
}

function MyForm() {
	return (
		<Formik
			initialValues={{
				account: "",
				password: "",
				save: false,
			}}
			validationSchema={signInValidate}
			onSubmit={(values) => console.log(values)}
		>
			{(formik) => (
				<div className={styles.formContainer}>
					<h1 className={styles.formTitle}>Đăng nhập</h1>
					<Form className={styles.formContent}>
						<TextField
							label="Tài khoản"
							type="text"
							name="account"
						/>
						<TextField
							label="Mật khẩu"
							type="password"
							name="password"
						/>
						<div class="form-check mt-3 mb-4">
							<input
								name="save"
								class="form-check-input"
								type="checkbox"
								id="autoSizingCheck"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.save}
							/>
							<label
								class="form-check-label"
								htmlFor="autoSizingCheck"
							>
								Lưu mật khẩu
							</label>
						</div>
						<div className={styles.buttonSpace}>
							<Link href="/register">
								<a className="btn btn-secondary m-2">Đăng ký</a>
							</Link>
							<button
								className="btn btn-primary m-2"
								type="submit"
							>
								Đăng nhập
							</button>
						</div>
					</Form>
				</div>
			)}
		</Formik>
	);
}
// export function MyForm({}) {
// 	return (

//         // <div className="abc">asdf</div>
// 	);
// }
