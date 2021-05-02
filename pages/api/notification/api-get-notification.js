import query from '../const/connection';


export default async function (req, res){
    const {from,numberOfItem} = req.body;
    const {userid} = req.headers;
    const result= await query("SELECT * FROM notification where destination = ?  order by time desc limit ?,? ",[userid,from,numberOfItem])
    res.status(200).json(result);
}