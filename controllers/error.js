exports.get404 = async (req, res) => {
	try {
		await res.status(404).render('404', {
			pageTitle: 'Error 404',
			path: '/404'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.get500 = async (req, res) => {
	try {
		await res.status(500).render('505', {
			pageTitle: 'Error 500',
			path: '/500'
		});
	} catch (error) {
		console.log(error);
	}
};
