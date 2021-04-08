import query from '../const/connection';

export default async function (req,res){
    const {id} = req.body;

    const result = await query("UPDATE notification set seen = 1 where id = ?",[id]);
    res.status(200).end();
}