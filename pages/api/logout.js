// Importing necessary modules
export default function handler(req, res) {
    // Only allow POST requests for logging out
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Clear the 'user_data' cookie by setting its Max-Age to 0
        res.setHeader('Set-Cookie', [
            `user_data=; Max-Age=0; Path=/; HttpOnly; Secure=${req.url.startsWith('https')}; SameSite=Lax`,
        ]);

        // Clear any other cookies if necessary, for example, a 'jwt_token' cookie
        res.setHeader('Set-Cookie', [
            `jwt_token=; Max-Age=0; Path=/; HttpOnly; Secure=${req.url.startsWith('https')}; SameSite=Lax`,
        ]);

        // Send a successful response back to the client
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Handle any errors
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
