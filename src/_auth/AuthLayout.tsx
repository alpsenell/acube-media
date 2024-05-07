import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated ?
        (<Navigate to="/" />) :
        (
          <>
            <section className="flex flex-1 justify-center items-center flex-col py-10">
              <Outlet />
            </section>

            <img
              src="/assets/images/AuthImage.jpg" alt="Main Image"
              className="hidden md:block h-screen w-1/2 object-center bg-no-repeat"
            />
          </>
        )}
    </>
  )
}

export default AuthLayout
