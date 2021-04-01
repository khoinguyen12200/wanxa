import "../styles/globals.css";
import "../styles/popupstyles.scss"

import "bootstrap/dist/css/bootstrap.min.css";
// import bootstrap from 'bootstrap'
import Head from "next/head";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "../components/StoreContext";
import {PopupContainer} from "../components/Popup";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<StoreProvider>
				<Head>
					<title>Wanxa</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<PopupContainer position={"top center"}/>
				<ToastContainer />
				<Navbar />
				<Component {...pageProps} />
			</StoreProvider>
		</div>
	);
}

export default MyApp;
