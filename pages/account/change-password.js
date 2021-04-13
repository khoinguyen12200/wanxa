import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {toast} from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../components/TextField";
import { passwordValidator } from "../../components/Validations";

import {AccountDir} from '../../components/Const';
import {StoreContext} from '../../components/StoreContext';
import styles from "../../styles/change-password.module.css";
export default function changePassword() {
    const router = useRouter();
    const {getSavedToken} = React.useContext(StoreContext);

	function onSubmit(values, { setSubmitting }) {
        const {oldPassword,newPassword} = values;
        const data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            token:getSavedToken(),
        }
        axios.post('/api/user/update-password', data)
            .then(res => {
                const {message} = res.data;
                if (res.status === 200) {
                    router.push(AccountDir)
                    toast.success(message);
                }else{
                    toast.error(message);
                }
                setSubmitting(false)
        
            })
            .catch(error => console.log(error));
    }
	return (
		<div className={styles.page}>
			<h3 className={styles.title}>Đổi mật khẩu</h3>
			<Formik
				initialValues={{
					oldPassword: "",
					newPassword: "",
					reNewPassword: "",
				}}
				validationSchema={Yup.object({
					oldPassword: passwordValidator,
					newPassword: passwordValidator,
					reNewPassword: Yup.string().oneOf(
						[Yup.ref("newPassword")],
						"Nhập lại không chính xác"
					),
				})}
				onSubmit={onSubmit}
			>
				{({ isSubmitting }) => (
					<Form className={styles.form}>
						<TextField
							label="Mật khẩu cũ"
							type="password"
							name="oldPassword"
						/>
						<TextField
							label="Mật khẩu mới"
							type="password"
							name="newPassword"
						/>
						<TextField
							label="Xác nhận lại"
							type="password"
							name="reNewPassword"
						/>
						<div className={styles.buttonSpace}>
							<button
								disabled={isSubmitting}
								type="submit"
								class="btn btn-primary"
							>
								Xác nhận
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}
