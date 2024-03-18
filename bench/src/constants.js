export const REACT_APP_BASE_URL = process.env.NODE_ENV === "development" ? `http://localhost:8000`: process.env.REACT_APP_BASE_URL
export const BASE_URL = `${REACT_APP_BASE_URL}/api`