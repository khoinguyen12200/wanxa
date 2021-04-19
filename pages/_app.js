import "../styles/globals.css";
import "../styles/popupstyles.scss";

import "bootstrap/dist/css/bootstrap.min.css";
// import bootstrap from 'bootstrap'
import Head from "next/head";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "../components/StoreContext";
import { PopupContainer } from "../components/Popup";
import { ModalContainer } from "../components/Modal";
import SocketContext,{socket} from "../components/SocketContext";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<SocketContext.Provider value={socket} >
				<StoreProvider>
					<Head>
						<title>Wanxa</title>
						<link rel="icon" href="/favicon.ico" />
					</Head>
					<PopupContainer position={"top center"} />
					<ModalContainer />
					<ToastContainer
						autoClose={2500}
						postion={toast.POSITION.TOP_CENTER}
					/>
					<Navbar />
					<Component {...pageProps} />
				</StoreProvider>
			</SocketContext.Provider>
		</div>
	);
}

export default MyApp;
