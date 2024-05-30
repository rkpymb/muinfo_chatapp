export default function handler(req, res) {
    if (req.method === 'POST') {
        const apiData = getApiDataFromCookie(req);
        const jwt_token = getTokenFromCookie(req);

        if (apiData && jwt_token) {
            
            res.status(200).json({ReqData: apiData,jwt_token});
            
        } else {
            // If no data found in cookies, return unauthorized
            res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

// Function to get API data from cookies
const getApiDataFromCookie = (req) => {
    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === 'user_data') {
                // Decode and parse the cookie value (as JSON)
                return JSON.parse(decodeURIComponent(cookieValue));
            }
        }
    }

    return null;
};

const getTokenFromCookie = (req) => {
    const cookieHeader = req.headers.cookie;

    if (cookieHeader) {
        const cookies = cookieHeader.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName.trim() === 'jwt_token') {
                return decodeURIComponent(cookieValue);
            }
        }
    }

    return null;
};
