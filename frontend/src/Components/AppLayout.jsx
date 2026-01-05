// AppLayout.js
import Header from "./Header";
import Footer from "./Footer";


function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#021510] text-white">
      {/* Header */}
      <Header />

      {/* Main content grows to fill remaining space */}
      <main className="flex-grow">
        {children}
       
      </main>

      {/* Footer sticks to bottom */}
      <Footer />
    </div>
  );
}

export default AppLayout;

