import query from "../../const/connection";

export default async function (req, res) {
    
    const {storeid,privileges} = req.headers;
    
    var arr = await query("SELECT * FROM `store-table-group` WHERE storeid = ?",storeid);
    for(let i in arr){
        var group = arr[i];
        const tables = await query("SELECT * FROM `store-table` WHERE groupid = ?",group.id);
        group.tables = tables;
    }
    res.status(200).json(arr)

}

