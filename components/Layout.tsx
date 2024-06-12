import Footer from './Footer';
import Header from './Header';
 

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />

      <style jsx>{`
        div {
          padding-top: 60px; /* Adjust based on header height */
          padding-bottom: 40px; /* Adjust based on footer height */
        }

        main {
          min-height: calc(100vh - 100px); /* Adjust based on header and footer height */
        }
      `}</style>
    </div>
  );
};

export default Layout;
