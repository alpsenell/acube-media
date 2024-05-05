import { createContext, useContext, useEffect, useState } from 'react'
import { IContextType, IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api.ts";
import { useNavigate } from 'react-router-dom'

export const INITIAL_USER = {
  email: '',
  name: '',
  id: '',
  imageUrl: '',
  password: '',
  bio: '',
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser()

      if (!currentAccount) {
        return false
      }

      setUser({
        username: currentAccount.username,
        name: currentAccount.name,
        id: currentAccount.$id,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
      })

      setIsAuthenticated(true)

      return false
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (
      localStorage.getItem('cookieFallback' === '[]')
    ) {
      navigate('/sign-in')
    }

    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    checkAuthUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext)
