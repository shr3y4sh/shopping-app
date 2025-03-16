const fs = require('fs');
const path = require('path');
const PDFDoc = require('pdfkit');

module.exports = async function (order, res) {
	const invoiceName = 'invoice-' + order._id.toString() + '.pdf';

	const invoicePath = path.join('data', 'invoice', invoiceName);

	const pdfDoc = new PDFDoc();

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'filename="' + invoiceName + '"');

	pdfDoc.pipe(fs.createWriteStream(invoicePath));
	pdfDoc.pipe(res);

	pdfDoc.fontSize(26).text('Invoice', {
		underline: true
	});

	pdfDoc.text('----------------------------------');

	let totalPrice = 0;
	order.products.forEach((prod) => {
		totalPrice += prod.quantity * prod.productData.price;
		pdfDoc
			.fontSize(14)
			.text(
				`${prod.productData.title} - ${prod.quantity} x $${prod.productData.price}`
			);
	});

	pdfDoc.text('----------------');

	pdfDoc.fontSize(18).text(`Total Price: $${totalPrice}`);

	pdfDoc.end();
};
