import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";



import TextField, { FileField } from "../../../../components/TextField";
import {
	passwordValidator,
	accountValidator,
	nameValidator,
} from "../../../../components/Validations";

import StoreNavBar from "../../../../components/StoreNavBar";
import styles from "../../../../styles/create-staff-account.module.css";

export default function create_staff_account() {
	const [arr, setArr] = React.useState([]);
	function addObject(user) {
		setArr([...arr, user]);
	}
	function removeObject(index) {
		var newA = arr;
		setArr(newA.splice(index, 1));
	}
    function newObject(){
        var user = {
            name: '',
            account: '',
            password: '',
            avatar: '',
        }
        var data = {
            user:user,
            saved:false
        }
        addObject(data);
    }
	return (
		<div className={styles.page}>
			<StoreNavBar />
			<h3 className={styles.title}>Tạo tài khoản nhân viên</h3>
			<div className={styles.content}>
                {
                    arr.map(object=>(
                        <User object={object}/>
                    ))
                }
				<button type="button" onClick={newObject} className="btn btn-sm btn-outline-success">Thêm</button>
			</div>
		</div>
	);
}

function User({object}) {
    const {user,saved} = object;
    function onChange(values){
        console.log(values);
    }
	return (
		<div>
			<Formik
				initialValues={{
					name: user.name || "",
					account: user.account || "",
					password: user.password || "",
					avatar: user.avatar || "",
				}}
				validationSchema={Yup.object({
					name: nameValidator,
					account: accountValidator,
					password: passwordValidator,
				})}
                on
			>
				<Form className={styles.form}>
					<TextField label="Họ tên" type="text" name="name" />
					<TextField label="Tài khoản" type="text" name="account" />
					<TextField
						label="Mật khẩu"
						type="password"
						name="password"
					/>

					<FileField
						label="Hình đại diện"
						hint="Mặc định (Không bắt buộc)"
						name="avatar"
						onChange={(event) => {
							setFieldValue("avatar", event.target.files[0]);
						}}
					/>
				</Form>
			</Formik>
		</div>
	);
}
