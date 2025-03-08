exports.get404 = async (req, res) => {
	try {
		res.status(404).render('404', {
			pageTitle: 'Error 404',
			path: '',
			isAuthenticated: req.session.isAuthenticated
		});
	} catch (error) {
		console.log(error);
	}
};
