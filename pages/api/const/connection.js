var mysql = require("mysql");


export const config = {
	api: {
		bodyParser: false,
	},
};

var pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "",
	database: "wanxa",
});

export default function promiseQuery(sql, arr) {
	return new Promise((resolve, reject) => {
		pool.query(sql, arr, function (err, results) {


			if (err) return reject(err);
			else return resolve(results);
		});
	});
}
