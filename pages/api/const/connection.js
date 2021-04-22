var connection = require('../../../server-connection');
export default connection.query;


// var mysql = require("mysql");

// var pool = mysql.createPool({
// 	connectionLimit: 50,
// 	host: "localhost",
// 	user: "root",
// 	password: "",
// 	database: "wanxa",
// });

// export default function(sql, arr) {
// 	return new Promise((resolve, reject) => {
// 		pool.query(sql, arr, function (err, results) {


// 			if (err) return reject(err);
// 			else return resolve(results);
// 		});
// 	});
// }