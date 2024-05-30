import axios from 'axios';

export default function handler(req, res) {
    if (req.method === 'POST') {
        axios.post(`${process.env.API_URL}user/reset_password_otp`, { 
            token: process.env.MYKEY ,
            mobile: req.body.mobile,
           
        
        },).then((response) => {
            res.status(200).json({ReqData: response.data });
            
        });

    } else {
        res.status(200).json({ ReqData: false });
    }
}