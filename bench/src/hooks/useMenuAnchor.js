import { useCallback, useMemo, useState } from "react"

export const useMenuAnchor = () => {
	const [anchor, setAnchor] = useState(null);
	const open = useMemo(()=>!!anchor, [anchor]);
	const update = useCallback(({currentTarget})=>setAnchor(p=>p ? null:currentTarget), [setAnchor]);
	return [anchor, open, update, setAnchor];
}