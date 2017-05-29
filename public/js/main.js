document.querySelector(`.delete-article`).addEventListener('click', e => {
	const id = e.target.getAttribute('data-id')
	fetch(`/article/${id}`, {
		method: 'delete'
	}).then(res => {
			window.location.href = '/'
		}
	)
})