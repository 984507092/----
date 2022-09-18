
export	function debounce(fn, t = 500) {
		let timer = null
		return function(...arg) {
			clearTimeout(timer)
			timer = setTimeout((v) => {
				fn.apply(this, arg)
			}, t)
		}
	}
	
	