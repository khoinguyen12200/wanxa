import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from "next/head";
import Navbar from '../components/Navbar'
function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Head>
				<title>Wanxa</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
      <Navbar/>

			<Component {...pageProps} />
		</div>
	);
}

export default MyApp;
