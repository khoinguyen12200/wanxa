import query from '../../const/connection';
export default async function (req, res) {

    const {storeid,privileges,userid} = req.headers;
    
    const groups = await query("SELECT * FROM `menu-group` WHERE storeid = ?",storeid);

    var newArr = [];
    for(let i in groups) {
        var group = groups[i];
        const items = await query("SELECT * FROM `menu-item` WHERE groupid = ?",[group.id]);
        group.items = items;
        newArr.push(group);
    }
    res.status(200).json(newArr);

}