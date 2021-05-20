import query from "../../const/connection";
import {getFacilities} from '../data';



export default async function (req, res) {
    
    const {storeid,privileges} = req.headers;
    
    const data = await getFacilities(storeid);


    res.status(200).json(data)

}

