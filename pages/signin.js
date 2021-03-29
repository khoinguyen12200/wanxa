import React from "react";
import { motion } from "framer-motion";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import Link from "next/link";
import { signInValidate } from "../components/Validations";
import { isMobile } from "../components/Const";
import Image from "next/image";

export default function SignIn({}) {
	return (
		<div className="sign-in">
			<div>
				<MyForm />
			</div>
			{!isMobile() && (
				<div className="banner">
					{/* <Image
						layout="fill"
						className="store"
						src="/icons/shops.svg"
					/> */}
					<motion.div
						initial={{ y: 0 }}
						animate={{ y: 100 }}
                        style={{width:100,height:100}}
						transition={{
							type: "spring",
							damping: 30,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					>
                        <Image layout='fill'  className="group" src="/icons/teamwork.svg" />
                    </motion.div>
				</div>
			)}
		</div>
	);
}

function MyForm () {
    return (
        <Formik
            initialValues={{
                account: "",
                password: "",
            }}
            validationSchema={signInValidate}
            onSubmit={(values) => console.log(values)}
        >
            {(formik) => (
                <div className="form-content">
                    <h1 className="title">Đăng nhập</h1>
                    <Form className="field-container">
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
                        <div class="form-check m-3">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                id="autoSizingCheck"
                            />
                            <label
                                class="form-check-label"
                                for="autoSizingCheck"
                            >
                                Lưu mật khẩu
                            </label>
                        </div>
                        <div className="button-space">
                            <button
                                className="btn btn-primary m-2"
                                type="submit"
                            >
                                Đăng nhập
                            </button>
                            <Link href="/register">
                                <a className="btn btn-secondary m-2">
                                    Đăng ký
                                </a>
                            </Link>
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
