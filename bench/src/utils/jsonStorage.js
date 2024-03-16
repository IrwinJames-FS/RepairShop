/**
 * Builds a json based storage system on either localStorage or sessionStorage.
 * @param {*} storage 
 */
export const buildStore = (storage) => {

	const getItem = key => {
		const item = storage.getItem(key);
		if(!item) return item;
		return JSON.parse(item);
	}

	const setItem = (key, value) => {
		//If value is falsy it should not be stringified
		if(!value) return storage.setItem(key, value);
		storage.setItem(key, JSON.stringify(value));
	}
	
	const removeItem = key=>storage.removeItem(key);
	
	return { getItem, setItem, removeItem };
}