import { useCallback, useState } from "react"

/**
 * I really didnt want to have to write this but so be it I suppose
 * @param {*} schema 
 */
export const useFormValues = (schema) => {
	const [state, setState] = useState(schema ?? {});
	const update = useCallback(({target, currentTarget})=>setState(s=>{
		const {name, value} = currentTarget ?? target; 
		return {...s, [name]:value};
	}),[setState])
	const reset = useCallback(()=>setState(schema ?? {}), [schema, setState]);
	return [state, update, reset];
}