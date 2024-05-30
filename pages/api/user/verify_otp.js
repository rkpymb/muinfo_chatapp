import axios from 'axios';

export default function handler(req, res) {
    if (req.method === 'POST') {
        axios.post(`${process.env.API_URL}user/verify_otp`, { 
            token: process.env.MYKEY ,
            mobile: req.body.mobile,
            otp: req.body.otp,
            
        
        },).then((response) => {
            res.status(200).json({ReqData: response.data });
            
        });

    } else {
        res.status(200).json({ ReqData: false });
    }
}