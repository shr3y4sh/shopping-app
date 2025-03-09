module.exports = async (req, res, next) => {
	if (!req.session.isAuthenticated) {
		return await res.redirect('/login');
	}
	next();
};
