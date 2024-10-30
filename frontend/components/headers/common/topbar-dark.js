import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Container, Row, Col } from "reactstrap";

const TopBarDark = ({ topClass, fluid }) => {
  const { data: session, status } = useSession();
  // console.log(session, status);

  return (
    <div className={topClass}>
      <Container fluid={fluid}>
        <Row>
          <Col lg="6">
            <div className="header-contact">
              <ul>
                <li>Welcome to Our store EcoWell</li>
                <li>
                  <i className="fa fa-phone text-white" aria-hidden="true"></i>
                  Call Us: 123 - 456 - 7890
                </li>
              </ul>
            </div>
          </Col>
          <Col lg="6" className="text-end">
            <ul className="header-dropdown">
              <li className="mobile-wishlist">
                <Link href="/page/account/wishlist">
                  <i className="fa fa-heart" aria-hidden="true"></i> wishlist
                </Link>
              </li>
              <li className="onhover-dropdown mobile-account">
                <i className="fa fa-user" aria-hidden="true"></i>{" "}
                {status === "authenticated" ? "My Account" : "Login now"}
                <ul className="onhover-show-div">
                  {status === "authenticated" ? (
                    <li onClick={() => signOut()}>
                      <a>Logout</a>
                    </li>
                  ) : (
                    <>
                      <li>
                        <Link href={`/page/account/login`}>Login</Link>
                      </li>
                      <li>
                        <Link href={`/page/account/register`}>Register</Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TopBarDark;
