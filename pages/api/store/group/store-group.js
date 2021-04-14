import query from "../../const/connection";
import formParse from '../../const/form'
import {getUserIdByToken} from '../../const/querySample'

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function (req, res) {

    const {storeid,token} = await formParse(req);

    const userid = await getUserIdByToken(token);
    const store = await query("SELECT `storeid` FROM `privileges` WHERE `userid`=? and `storeid`=?",[userid,storeid]);
    if(store.length > 0) {
        const groups = await query("SELECT * FROM `store-table-group` WHERE `storeid`=?",storeid);
        var newGroups = [];
        for(let i in groups) {
            var group = groups[i];
            const tables = await query("SELECT * FROM `store-table` WHERE `groupid`=?",group.id);
            group.tables = tables;
            newGroups.push(group);
        }
        res.status(200).json({group:newGroups})  
    }else{
        res.status(202).json({message: 'Bạn không có quyền để vào đây'})  
    }
	
}