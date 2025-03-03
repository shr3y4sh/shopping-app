exports.get404 = (req, res) => {
	res.status(404).render('404', { pageTitle: 'Error 404', path: '' });
};
