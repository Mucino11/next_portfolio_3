// src/components/Layout.tsx
import Navbar from "./Navbar";
import Footer from "./Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main> {/* Main content area for the page */}
      <Footer />
    </div>
  );
};

export default Layout;
