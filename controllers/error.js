exports.get404 = async (req, res, next) => {
	try {
		await res.status(404).render('404', {
			pageTitle: 'Error 404',
			path: '/404'
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};

exports.get500 = async (req, res, next) => {
	try {
		await res.status(500).render('500', {
			pageTitle: 'Error 500',
			path: '/500'
		});
	} catch (error) {
		const err = new Error(error);
		err.httpStatusCode = 500;
		return next(err);
	}
};
