import query from "../../const/connection";
import { getUserIdByToken,getPrivileges } from "../../const/querySample";
import Privileges from '../../../../components/Privileges';


export default async function (req, res) {
    const {storeid} = req.body;
    
    var arr = await query("SELECT * FROM `store-table-group` WHERE storeid = ?",storeid);
    for(let i in arr){
        var group = arr[i];
        const tables = await query("SELECT * FROM `store-table` WHERE groupid = ?",group.id);
        group.tables = tables;
    }
    res.status(200).json(arr)

}

