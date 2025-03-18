const deleteProduct = async (button) => {
	try {
		const prodId =
			button.parentNode.querySelector('[name=productId]').value;
		const csrfToken = button.parentNode.querySelector('[name=_csrf]').value;

		const productElement = button.closest('article');

		const responseBody = await fetch('/admin/product/' + prodId, {
			method: 'DELETE',
			headers: {
				'csrf-token': csrfToken
			}
		});
		console.log(responseBody);

		productElement.remove();
	} catch (error) {
		console.log(error);
	}
};

const delButton = document.querySelector('#delete-button');

delButton.addEventListener('click', (e) => {
	deleteProduct(e.target);
});
