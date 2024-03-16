export const parseFormElements = (elements, filter) => {
	let obj = {};
	for(const key in elements) {
		if(key !== elements[key].name) continue;
		const v = elements[key].value?.trim();
		if(filter && ((typeof filter === 'object' && filter[key] === v) || !v)) continue;
		obj[key] = v;
	}
	return obj;
}