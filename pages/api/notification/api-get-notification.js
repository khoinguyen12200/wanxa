import query from '../const/connection';
import {getUserIdByToken} from '../const/querySample';


export default async function (req, res){
    const {from,numberOfItem,token} = req.body;
    const userid = await getUserIdByToken(token);
    const result= await query("SELECT * FROM notification where destination = ?  order by time desc limit ?,? ",[userid,from,numberOfItem])
    res.status(200).json(result);
}