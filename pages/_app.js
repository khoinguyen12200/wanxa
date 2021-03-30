import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "../components/StoreContext";

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<StoreProvider>
				<Head>
					<title>Wanxa</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>

				<ToastContainer />
				<Navbar />
				<Component {...pageProps} />
			</StoreProvider>
		</div>
	);
}

export default MyApp;
