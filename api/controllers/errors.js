const { ApiError } = require("../errors");
const { invalidData, bad } = require("../httpCodes");

exports.writeErrors = (error, next) => {
	if(error.errors) return next(new ApiError('Please correct the following errors', invalidData, {errors:Object.keys(error.errors).reduce((p,c,i)=>({...p, [c]:error.errors[c].message}), {})}));
	if(error.code){
		switch (error.code) {
			case 11000:
				const key = Object.keys(error.keyPattern)[0]
				return next(`Duplicate ${key}`, invalidData)
		}
	}
	return next(new ApiError(error.message, bad));
}

exports.generalErrors = (error, next, status=500) => next(new ApiError(error.message, status));