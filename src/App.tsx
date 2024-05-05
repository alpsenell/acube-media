import { Routes, Route } from "react-router-dom";

import './globals.css'
import SigninForm from "./_auth/forms/SigninForm.tsx";
import SignupForm from "./_auth/forms/SignupForm.tsx";
import { Home } from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/RootLayout.tsx";
import { Toaster } from '@/components/ui/toaster'

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}
export default App
