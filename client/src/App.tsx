"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { AuthProvider, useAuth } from "@/hooks/useAuth"
import { getAuthToken } from "@/services/api"
import { LoginForm } from "@/components/LoginForm"
import { RegisterForm } from "@/components/RegisterForm"
import { WalletDashboard } from "@/components/WalletDashboard"
import { ProtectedRoute } from "@/components/ProtectedRoute"

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL || "http://localhost:3000"}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginForm />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterForm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <WalletDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
