import React from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";

import TextField, { FileField } from "../../components/TextField";
import {
	passwordValidator,
	accountValidator,
	nameValidator,
} from "../../components/Validations";
import { isMobile,SignInDir } from "../../components/Const";
import styles from "../../styles/Register.module.css";


export default function Register({}) {
	const router = useRouter();

	function handleSubmit(values, { setSubmitting }) {
		var formData = new FormData();
		formData.append("account", values.account);
		formData.append("password", values.password);
		formData.append("name", values.name);
		formData.append("avatar", values.avatar);

		axios
			.post("/api/user/register", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				if (res.status === 200) {
					toast.success(res.data.message);
					router.push(SignInDir);
				} else {
					toast.error(res.data.message);
				}
				setSubmitting(false);
			})
			.catch((error) => console.log(error));
	}
	return (
		<div className={styles.register}>
			{!isMobile() && (
				<div className={styles.banner}>
					<img
						src="/icons/profile.svg"
						alt=""
						className={styles.profile}
					/>
				
				</div>
			)}

			<Formik
				initialValues={{
					name: "",
					account: "",
					password: "",
					repassword: "",
					avatar: "",
				}}
				validationSchema={Yup.object({
					name: nameValidator,
					account: accountValidator,
					password: passwordValidator,
					repassword: Yup.string().oneOf(
						[Yup.ref("password"), null],
						"Nhập lại chưa chính xác"
					),
					avatar: Yup.string().required("Bắt buộc phải có"),
				})}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, setFieldValue }) => (
					<div className={styles.content}>
						<h1 className={styles.title}>Đăng ký</h1>
						<Form className={styles.form}>
							<TextField label="Họ tên" type="text" name="name" />
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
							<TextField
								label="Nhập lại mật khẩu"
								type="password"
								name="repassword"
							/>
							<FileField
								label="Hình đại diện"
								name="avatar"
								onChange={(event) => {
									setFieldValue(
										"avatar",
										event.target.files[0]
									);
								}}
							/>
							<div className={styles.buttonSpace}>
								<button
									className="btn btn-primary"
									type="submit"
									disabled={isSubmitting}
								>
									Đăng ký
								</button>
								<button
									className="btn btn-danger m-3"
									type="reset"
								>
									Làm lại
								</button>
							</div>
						</Form>
					</div>
				)}
			</Formik>
		</div>
	);
}
