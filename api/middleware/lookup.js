const { generalErrors } = require("../controllers/errors");

const lookup = (store, key, properties) => {
	return async (req, res, next) => {
		const {id} = req.params;
		try {
			const item = await store.findById(id, properties);
			if(!item) return res.status(404).json({message: `${key.charAt(0).toUppercase()+key.slice(1)} not found`});
			res[key] = item;
			return next();
		} catch (error) {
			return generalErrors(error, next);
		}
	}
}


const sublookup = (doc, property, cid, key, pop) => {
	return async (req, res, next) => {
		if (pop) {
			try{
				await res[doc].populate(...pop)
			} catch (error) {
				return generalErrors(error, next)
			}
		}
		const id = req.params[cid]
		const item = res[doc][property].id(id);
		if(!item) return generalErrors({message: `${key.charAt(0).toUppercase()+key.slice(1)} not found`}, next);
		res[key] = item;
		return next();
	}
}
module.exports = {lookup, sublookup};