import axios from 'axios';

export default function handler(req, res) {
    if (req.method === 'POST') {
        axios.post(`${process.env.API_URL}user/user_signup`, { 
            token: process.env.MYKEY ,
            mobile: req.body.mobile,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            referralCode: req.body.referralCode
        
        },).then((response) => {
            res.status(200).json({ReqData: response.data });
            
        });

    } else {
        res.status(200).json({ ReqData: false });
    }
}