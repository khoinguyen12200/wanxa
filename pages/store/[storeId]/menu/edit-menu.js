import React from "react";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import TextField, {
	FileField,
	TextAreaField,
} from "../../../../components/TextField";
import Validate from "../../../../components/Validations";
import styles from "../../../../styles/edit-menu.module.css";
import Nav from "../../../../components/MultiLevelNavbar";
import { Direction, useStoreStaff } from "../../../../components/Const";
import Privileges from "../../../../components/Privileges";
import { CanNotAccess } from "../../../../components/Pages";
import { StoreContext } from "../../../../components/StoreContext";
import { promptDialog, alertDialog } from "../../../../components/Modal";
export default function EditMenu() {
	const router = useRouter();
	const { storeId } = router.query;

	const [groups, setGroups] = React.useState([]);

	React.useEffect(() => {
		fetchData();
	}, [storeId]);
	function fetchData() {
		if (storeId == null) return;
		const data = {
			storeid: storeId,
		};
		axios
			.post("/api/store/menu/api-get-group", data)
			.then((res) => {
				if (res.status === 200) {
					setGroups(res.data);
					console.log(res.data);
				}
			})
			.catch((error) => console.log(error));
	}
	const { getSavedToken, getStorePrivileges, state } = React.useContext(
		StoreContext
	);

	const access = React.useMemo(() => {
		const value = getStorePrivileges(storeId);
		const pri = Privileges.isValueIncluded(value, [
			Privileges.Content.OWNER,
			Privileges.Content.MENU,
		]);
		return pri ? 1 : -1;
	}, [storeId, state]);

	if (access == -1) {
		return <CanNotAccess />;
	}

	function addGroup() {
		promptDialog("Nhập tên nhóm thực đơn", (value) => {
			const str = value.trim();
			const data = {
				token: getSavedToken(),
				name: str,
				storeid: storeId,
			};
			axios
				.post("/api/store/menu/api-add-group", data)
				.then((res) => {
					const { message } = res.data;
					fetchData();
					if (res.status === 200) {
						toast.success(message);
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		});
	}
	return (
		<div>
			<Nav />
			<div className={styles.content}>
				<h3 className={styles.title}>Chỉnh sửa menu</h3>
				<div className={styles.list}>
					{groups.map((group) => {
						return (
							<Group
								group={group}
								key={group.id}
								update={fetchData}
							/>
						);
					})}
					<div className={styles.addGroupSpace}>
						<button
							onClick={addGroup}
							className="btn btn-outline-primary btn-sm m-atuo"
						>
							Thêm nhóm mới
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function Group({ group, update }) {
	const { getSavedToken } = React.useContext(StoreContext);

	const InputRef = React.useRef(null);

	const [value, setValue] = React.useState(group.name);
	React.useEffect(() => {
		setValue(group.name);
	}, [group]);
	function updateName(e) {
		if (e) e.preventDefault();
		alertDialog("Bạn có muốn lưu lại với tên mới ?", () => {
			run();
		});
		function run() {
			const name = value.trim();
			const data = {
				id: group.id,
				name: name,
				token: getSavedToken(),
			};
			axios
				.post("/api/store/menu/api-update-group-name", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
						if (InputRef && InputRef.current)
							InputRef.current.blur();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}
	function deleteGroup(e) {
		if (e) e.preventDefault();
		alertDialog(
			"Bạn có muốn xóa nhóm này (Tất cả các món trong nhóm sẽ bị mất theo)",
			() => {
				run();
			}
		);
		function run() {
			const data = {
				id: group.id,
				token: getSavedToken(),
			};
			axios
				.post("/api/store/menu/api-delete-group", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}
	return (
		<div className={styles.group}>
			<form className={styles.groupName}>
				<button
					onClick={deleteGroup}
					type="button"
					className="btn btn-danger btn-sm mr-2"
				>
					Xóa
				</button>
				<input
					ref={InputRef}
					className="form-control"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				{value.trim() != group.name && (
					<>
						<button
							onClick={updateName}
							className="btn btn-warning btn-sm ml-2"
						>
							Lưu lại
						</button>
						<button
							onClick={() => {
								setValue(group.name);
							}}
							className="btn btn-secondary btn-sm ml-2"
						>
							Hủy
						</button>
					</>
				)}
			</form>
			<div className={styles.itemList}>
				{group.items.map((item) => (
					<MenuItem
						key={item.id}
						item={item}
						update={update}
						groupId={group.id}
					/>
				))}
				<AddMenuItemForm groupId={group.id} update={update} />
			</div>
		</div>
	);
}

function MenuItem({ item, update, groupId }) {
	const { getSavedToken } = React.useContext(StoreContext);

	const NameRef = React.useRef(null);
	const DesRef = React.useRef(null);
	const PriceRef = React.useRef(null);

	function blur() {
		if (NameRef && NameRef.current) NameRef.current.blur();
		if (DesRef && DesRef.current) DesRef.current.blur();
		if (PriceRef && PriceRef.current) PriceRef.current.blur();
	}

	const [name, setName] = React.useState(item.name);
	const [des, setDes] = React.useState(item.des);

	const [price, setPrice] = React.useState(item.price);
	function submitPrice(e) {
		if (e != null) e.preventDefault();
		if (Validate.MenuItemPrice.isValidSync(price)) {
			const data = {
				price: price,
				token: getSavedToken(),
				id: item.id,
				groupid: groupId,
			};
			axios
				.post("/api/store/menu/api-update-item-price", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
						blur();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}
	function submitName(e) {
		if (e != null) e.preventDefault();
		if (Validate.MenuItemName.isValidSync(name)) {
			const data = {
				name: name,
				token: getSavedToken(),
				id: item.id,
				groupid: groupId,
			};
			axios
				.post("/api/store/menu/api-update-item-name", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
						blur();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}
	function submitDes() {
		if (Validate.MenuItemDes.isValidSync(des)) {
			const data = {
				des: des,
				token: getSavedToken(),
				id: item.id,
				groupid: groupId,
			};
			axios
				.post("/api/store/menu/api-update-item-des", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
						blur();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		}
	}
	function deleteItem() {
		alertDialog("Bạn có chắc muốn xóa món ?", () => {
			const data = {
				token: getSavedToken(),
				id: item.id,
				groupid: groupId,
			};
			axios
				.post("/api/store/menu/api-delete-item", data)
				.then((res) => {
					const { message } = res.data;
					if (res.status === 200) {
						toast.success(message);
						if (update) update();
						blur();
					} else {
						toast.error(message);
					}
				})
				.catch((error) => console.log(error));
		});
	}
	return (
		<div className={styles.item}>
			<div className={styles.itembtndelete}>
				<button
					onClick={deleteItem}
					className="btn btn-sm btn-outline-danger mb-2"
				>
					Xóa món
				</button>
			</div>
			<div className={styles.itemS1}>
				<div className={styles.itemS1Left}>
					<img
						className={styles.itemPicture}
						src={item.picture || Direction.DefaultMenu}
					/>
					<div className={styles.imgBtns}>
						<button className="btn btn-primary btn-sm m-1">Thay đổi</button>
						<button className="btn btn-warning btn-sm  m-1">Lưu</button>
					</div>
				</div>

				<div className={styles.itemS1Right}>
					<form className={styles.itemName} onSubmit={submitName}>
						<input
							ref={NameRef}
							type="text"
							className="form-control"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						{name.trim() != item.name && (
							<div className={styles.itemButtons}>
								<button className="btn btn-sm btn-warning mr-1">
									Lưu lại
								</button>
								<button
									onClick={() => setName(item.name)}
									className="btn btn-sm btn-secondary mr-1"
								>
									Hủy
								</button>
							</div>
						)}
					</form>
					<div className={styles.itemDes}>
						<textarea
							ref={DesRef}
							onChange={(e) => {
								setDes(e.target.value);
							}}
							className="form-control"
							value={des}
						></textarea>

						{des != item.des && (
							<div className={styles.itemButtons}>
								<button
									onClick={submitDes}
									className="btn btn-sm btn-warning mr-1"
								>
									Lưu lại
								</button>
								<button
									onClick={() => {
										setDes(item.des);
									}}
									className="btn btn-sm btn-secondary mr-1"
								>
									Hủy bỏ
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className={styles.itemS2}>
				<form className={styles.itemPrice} onSubmit={submitPrice}>
					<input
						ref={PriceRef}
						type="number"
						className="form-control"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
					{price != item.price && (
						<div className={styles.itemButtons}>
							<button className="btn btn-sm btn-warning mr-1">
								Lưu lại
							</button>
							<button
								onClick={() => setPrice(item.price)}
								type="button"
								className="btn btn-sm btn-secondary mr-1"
							>
								Lưu lại
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

function AddMenuItemForm({ groupId, update }) {
	// show a button as default

	const { getSavedToken } = React.useContext(StoreContext);

	const [modal, setModal] = React.useState(false);

	const toggle = (value) => {
		if (typeof value == "boolean") {
			setModal(value);
		} else {
			setModal(!modal);
		}
	};

	function handleSubmit(values, { setSubmitting }) {
		const data = new FormData();
		data.append("name", values.name);
		data.append("des", values.des);
		data.append("price", values.price);
		data.append("picture", values.picture);
		data.append("token", getSavedToken());
		data.append("groupid", groupId);

		axios
			.post("/api/store/menu/api-add-item", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				const { message } = res.data;
				if (res.status == 200) {
					toast.success(message);
					toggle(false);
					if (update != null) {
						update();
					}
				} else {
					toast.error(message);
				}
				setSubmitting(false);
			})
			.catch((error) => console.log(error));
	}
	return (
		<div>
			<button
				onClick={toggle}
				className="btn btn-outline-primary btn-sm m-1"
			>
				Thêm món
			</button>
			<Modal isOpen={modal} toggle={toggle} centered backdrop="static">
				<ModalHeader toggle={toggle}>Thêm vào menu</ModalHeader>
				<ModalBody>
					<Formik
						initialValues={{
							name: "",
							des: "",
							price: 0,
							picture: null,
						}}
						validationSchema={Yup.object({
							name: Validate.MenuItemName,
							des: Validate.MenuItemDes,
							price: Validate.MenuItemPrice,
						})}
						onSubmit={handleSubmit}
					>
						{({ isSubmitting, setFieldValue }) => (
							<div className={styles.content}>
								<Form className={styles.form}>
									<TextField
										label="Tên món"
										type="text"
										name="name"
									/>
									<TextAreaField
										label="Mô tả món ăn"
										type="text"
										name="des"
									/>
									<TextField
										label="Giá"
										type="number"
										name="price"
									/>
									<FileField
										label="Hình ảnh"
										hint="Không yêu cầu"
										name="picture"
										onChange={(event) => {
											setFieldValue(
												"picture",
												event.target.files[0]
											);
										}}
									/>
									<div className={styles.addItemBtnSpace}>
										<button
											className="btn btn-primary mr-3"
											type="submit"
											disabled={isSubmitting}
										>
											Thêm
										</button>
										<button
											className="btn btn-danger mr-3"
											type="reset"
										>
											Làm lại
										</button>
										<button
											className="btn btn-secondary mr-3"
											type="button"
											onClick={toggle}
										>
											Hủy bỏ
										</button>
									</div>
								</Form>
							</div>
						)}
					</Formik>
				</ModalBody>
			</Modal>
		</div>
	);
}
