import {getMenus} from '../data';

export default async function (req, res) {

    const {storeid} = req.headers;
    const result = await getMenus(storeid);
    res.json(result);
}