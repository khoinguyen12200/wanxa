import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { AiOutlineDoubleRight } from "react-icons/ai";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
} from "reactstrap";
import { isMobile, SignInDir, AboutDir, AccountDir, StoreDir } from "./Const";
import { StoreContext } from "./StoreContext";

export default function StoreNavbar() {
	const router = useRouter();
	const { storeId } = router.query;
	const arr = React.useMemo(() => getAllPath(router), [router]);
	return (
		<div className="store-nav">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb">
					{arr &&
						arr.map(({ path, title }, index) => (
							<Link href={path} key={path}>
								<li key={path} className="breadcrumb-item">
									<a className="store-link">
										{mapName(title)}
									</a>
								</li>
							</Link>
						))}
				</ol>
			</nav>

			<style jsx>{`
				.store-link {
					cursor: pointer;
				}
			`}</style>
		</div>
	);
}
function mapName(name) {
	const { state } = React.useContext(StoreContext);
	const user = state ? state.user : null;
	const stores = user ? user.stores : null;

	const router = useRouter();
	const { storeId } = router.query;

	var nameStore = "Cửa hàng";
	for (let i in stores) {
		const store = stores[i];
		if (storeId == store.storeid) {
			nameStore = store.name;
		}
	}

	switch (name) {
		case "store":
			return nameStore;
		case "facility":
			return "Cơ sở vật chất";
		case "edit-facility":
			return "Chỉnh sửa";
		case "basic-info":
			return "Thông tin cơ bản";
		case "real-time":
			return "Thời gian thực";
		case "hrm":
			return "Quản lý nhân sự";
		case "create-staff-account":
			return "Tạo tài khoản nhân viên";
		case "internal-notification":
			return "Thông báo nội bộ";
		case "detail":
			return "Chi tiết thông báo";
		case "create":
			return "Tạo thông báo";
		case "menu":
			return "Thực đơn";
		case "edit-menu":
			return "Chỉnh sửa";
		case "create-bill":
			return "Tạo hóa đơn";
		case "barista":
			return "Pha chế";
		case "manage-bill":
			return "Quản lý hóa đơn";
		case "bills":
			return "Quản lý hóa đơn";
	}
	return name;
}

function getAllPath(router) {
	var { pathname, asPath } = router;
	pathname = pathname.slice(1);
	asPath = asPath.slice(1);

	var arrSample = pathname.split("/");
	var arrReal = asPath.split("/");

	var res = [];
	var current = "";
	for (let i = 0; i < arrSample.length; i++) {
		current += "/" + arrReal[i];
		if (arrSample[i].includes("[")) {
			if (res[res.length - 1] !== undefined)
				res[res.length - 1].path = current;
		} else {
			res.push({ path: current, title: arrSample[i] });
		}
	}
	return res;
}
