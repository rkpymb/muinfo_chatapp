import axios from 'axios';

export default function handler(req, res) {
    if (req.method === 'POST') {
        axios.post(`${process.env.API_URL}user/user_login`, { 
            token: process.env.MYKEY ,
            mobile: req.body.mobile,
            PassKey: req.body.password,
            
        
        },).then((response) => {
            res.status(200).json({ReqData: response.data });
            
        });

    } else {
        res.status(200).json({ ReqData: false });
    }
}