import { Outlet } from "react-router-dom"
import LeftSidebar from "@/components/common/LeftSidebar.tsx"
import BottomBar from "@/components/common/BottomBar.tsx"
import TopBar from "@/components/common/TopBar.tsx"

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <BottomBar />
    </div>
  )
}

export default RootLayout
