import React from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";

import { signInValidate } from "../../components/Validations";
import { isMobile,AccountDir,RegisterDir } from "../../components/Const";
import styles from "../../styles/SignIn.module.css";
import TextField from "../../components/TextField";
import {StoreContext,actions} from '../../components/StoreContext'

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
	const router = useRouter();
	const [state,dispatch] = React.useContext(StoreContext);
	function handleSubmit(values,{ setSubmitting}){
		axios.post('/api/user/signin', values)
			.then(res => {
				if (res.status === 200) {
					const {message,token,user} = res.data;
					toast.success(message);
					const payload = {user:user,token:token,save:values.save};
					dispatch({type:actions.signIn,payload:payload});
					router.push(AccountDir);
					
				}else{
					toast.error(res.data.message);
				}
				setSubmitting(false)
		
			})
			.catch(error => toast.error(error));
		
	}
	return (
		<Formik
			initialValues={{
				account: "",
				password: "",
				save: false,
			}}
			validationSchema={signInValidate}
			onSubmit={handleSubmit}
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
						<div className="form-check mt-3 mb-4">
							<input
								name="save"
								className="form-check-input"
								type="checkbox"
								id="autoSizingCheck"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.save}
							/>
							<label
								className="form-check-label"
								htmlFor="autoSizingCheck"
							>
								Lưu mật khẩu
							</label>
						</div>
						<div className={styles.buttonSpace}>
							<Link href={RegisterDir}>
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
