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
		<div style={styles.nav}>
			{arr &&
				arr.map(({ path, title }, index) => (
					<Link href={path}  key={path}>
						<a style={styles.link} >
							{mapName(title)}
							{index != arr.length - 1 && (
								<AiOutlineDoubleRight style={styles.arrow}/>
							)}
						</a>
					</Link>
				))}
		</div>
	);
}
function mapName(name) {
    const {state} = React.useContext(StoreContext);
	const user = state ? state.user : null;
	const stores = user ? user.stores : null;

	const router = useRouter();
	const { storeId } = router.query;

	var nameStore = "Cửa hàng";
	for(let i in stores){
		const store = stores[i];
		if(storeId == store.storeid){
			nameStore = store.name;
		}
	}

    switch (name) {
        case "store" : return nameStore;
        case "facility" : return "Cơ sở vật chất";
        case "basic-info" : return "Thông tin cơ bản";
        case "real-time" : return "Thời gian thực";
    }
    return name;
}
const styles = {
	nav: {
		padding:"10px 20px",
        fontSize:"1.1em"
	},
    link:{
        padding:5
    },
    arrow: {
        marginLeft:3
    },
};

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
			res[i - 1].path = current;
		} else {
			res.push({ path: current, title: arrSample[i] });
		}
	}
	return res;
}
