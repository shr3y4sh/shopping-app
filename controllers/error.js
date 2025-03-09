exports.get404 = async (req, res) => {
	try {
		await res.status(404).render('404', {
			pageTitle: 'Error 404',
			path: ''
		});
	} catch (error) {
		console.log(error);
	}
};
