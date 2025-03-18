const fs = require('fs');
// const { file } = require('pdfkit')

module.exports = function (filePath) {
	try {
		fs.unlink(filePath, (err) => {
			if (err) {
				throw err;
			}
		});
	} catch (error) {
		console.log(error);
	}
};
