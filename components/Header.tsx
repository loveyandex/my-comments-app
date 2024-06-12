import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/page/owner">Owners</Link>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        header {
          background-color: #333;
          color: #fff;
          padding: 10px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
        }

        nav ul li {
          margin-right: 20px;
        }

        nav ul li:last-child {
          margin-right: 0;
        }

        nav ul li a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </header>
  );
};

export default Header;
