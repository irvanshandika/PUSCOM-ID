import Link from "next/link";
import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__left">
              <Link href="/">
                <div className="footer__logo">Logo</div>
              </Link>
            </div>
            <div className="footer__right">
              <p>&copy; {year} All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
