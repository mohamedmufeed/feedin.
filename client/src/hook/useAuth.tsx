import { useSelector } from "react-redux"
import type { RootState } from "../redux/store/store"

export const useAuth = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const isAdmin=useSelector((sate:RootState)=>sate.auth.isAdmin)
     return {
    isAuthenticated: Boolean(user),
    isAdmin,
  }
}