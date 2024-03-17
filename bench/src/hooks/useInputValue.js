import { useCallback, useState } from "react"

export const useInputValue = (initialValue="") => {
	const [s, setS] = useState(initialValue);
	const update = useCallback(({currentTarget})=>setS(currentTarget.value), [setS]);
	return [s, update, setS];
}