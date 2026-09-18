import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TopPromoBanner } from "../components/TopPormoBanner";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopPromoBanner />
      <div className=" sticky top-0 z-50 w-full bg-white shadow-sm">
        <Header />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
