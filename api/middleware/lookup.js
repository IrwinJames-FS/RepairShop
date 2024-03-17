const lookup = (store, key, properties) => {
	return async (req, res, next) => {
		const {id} = req.params;
		try {
			const item = await store.findById(id, properties);
			if(!item) return res.status(404).json({message: `${key.charAt(0).toUppercase()+key.slice(1)} not found`});
			res[key] = item;
			return next();
		} catch (error) {
			return res.status(500).json({message: error.message});
		}
	}
}


const sublookup = (doc, property, cid, key, pop) => {
	return async (req, res, next) => {
		if (pop) {
			try{
				await res[doc].populate(...pop)
			} catch (error) {
				console.log(error);
				return res.status(500).json({message: "Oops something went wrong"});
			}
		}
		const id = req.params[cid]
		const item = res[doc][property].id(id);
		if(!item) return res.status(404).json({message: `${key.charAt(0).toUppercase()+key.slice(1)} not found`});
		res[key] = item;
		return next();
	}
}
module.exports = {lookup, sublookup};