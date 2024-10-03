const ensureAuthenticated = (req, res, next) => {
    console.log('Cookies:', req.cookies); 
     // Check if cookies are present
    if (!req.cookies) {
        return res.status(403).json({ message: 'Token is required' });
    }

    /// Check if token is present in cookies
    const token = req.cookies['token'];
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    // Verify the token
            try {
                const decoded = jwt.verify(token, process.env.SECRET);
                req.user = decoded;
                return next();
            } catch (error) {
                return res.status(401)
                    .json({ message: 'Invalid token or token is expired',error });
            }
    
    
};
module.exports = ensureAuthenticated;