import query from "../../const/connection";

export default async function (req, res) {
	const { userid, storeid, privileges } = req.headers;
	const result = await query("select * from store where id = ?", [storeid]);
    const info = result.length > 0 ? result[0] : null;
    if(info){
        res.status(200).json({data:info})
    }else{
        res.status(200).json({error:true,data:info})
    }
}
