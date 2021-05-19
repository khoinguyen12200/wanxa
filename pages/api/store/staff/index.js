import {getStaffs} from '../data';

export default async function (req, res) {
    const {storeid} = req.headers;
    const resu = await getStaffs(storeid);
    res.json(resu);
}