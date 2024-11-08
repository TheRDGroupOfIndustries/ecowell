import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Collapse,
  Alert,
} from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import { useSession } from "next-auth/react";

const MasterFooter = ({
  containerFluid,
  logoName,
  layoutClass,
  footerClass,
  footerLayOut,
  footerSection,
  belowSection,
  belowContainerFluid,
  CopyRightFluid,
  newLatter,
}) => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?._id;

  const width = window.innerWidth <= 767;

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setStatus({
        type: "error",
        message: "Please sign in to subscribe to our newsletter",
      });
      return;
    }

    if (!email) {
      setStatus({
        type: "error",
        message: "Please enter an email address",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/Newsletter/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emails: [email],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Successfully subscribed to newsletter!",
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to subscribe to newsletter",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred while subscribing",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth <= 767) {
        setCollapse(0);
        setIsOpen(false);
      } else setIsOpen(true);
    };

    window.addEventListener("resize", changeCollapse);

    return () => {
      window.removeEventListener("resize", changeCollapse);
    };
  }, []);

  return (
    <div>
      <footer className={footerClass}>
        {newLatter ? (
          <div className={footerLayOut}>
            <Container fluid={containerFluid ? containerFluid : ""}>
              <section className={footerSection}>
                <Row>
                  <Col lg="6">
                    <div className="subscribe">
                      <div>
                        <h4>KNOW IT ALL FIRST!</h4>
                        <p>
                          Never Miss Anything From Ecowell By Signing Up To
                          Our Newsletter.
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col lg="6">
                    <Form className="form-inline subscribe-form" onSubmit={handleNewsletterSubmit}>
                      <div className="mx-sm-3">
                        <Input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="btn btn-solid"
                        disabled={isLoading}
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </Form>
                    {status.message && (
                      <Alert
                        color={status.type === "success" ? "success" : "danger"}
                        className="mt-3"
                      >
                        {status.message}
                      </Alert>
                    )}
                  </Col>
                </Row>
              </section>
            </Container>
          </div>
        ) : null}

        <section className={belowSection}>
          <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
            <Row className="footer-theme partition-f">
              <Col lg="4" md="6">
                <div
                  className={`footer-title ${
                    isOpen && collapse == 1 ? "active" : ""
                  } footer-mobile-title`}>
                  <h4
                    onClick={() => {
                      setCollapse(1);
                      setIsOpen(!isOpen);
                    }}>
                    about
                    <span className="according-menu"></span>
                  </h4>
                </div>
                <Collapse
                  isOpen={width ? (collapse === 1 ? isOpen : false) : true}>
                  <div className="footer-contant">
                    <div className="footer-logo">
                      <LogoImage logo={logoName} />
                    </div>
                    <p>
                      Ecowell offers premium, natural supplements to support your wellness journey. With sustainably sourced ingredients and science-backed formulas, we’re here to help you live healthier every day.
                    </p>
                    <div className="footer-social">
                      <ul>
                        <li>
                          <a href="https://www.facebook.com" target="_blank">
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"></i>
                          </a>
                        </li>
                        {/* <li>
                          <a href="https://plus.google.com" target="_blank">
                            <i
                              className="fa fa-google-plus"
                              aria-hidden="true"></i>
                          </a>
                        </li> */}
                        <li>
                          <a href="https://twitter.com" target="_blank">
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                          </a>
                        </li>
                        <li>
                          <a href="https://www.instagram.com" target="_blank">
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"></i>
                          </a>
                        </li>
                        {/* <li>
                          <a href="https://rss.com" target="_blank">
                            <i className="fa fa-rss" aria-hidden="true"></i>
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </Collapse>
              </Col>
              <Col className="offset-xl-1">
                <div className="sub-title">
                  <div
                    className={`footer-title ${
                      isOpen && collapse == 2 ? "active" : ""
                    } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(2);
                        } else setIsOpen(true);
                      }}>
                      Products
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 2 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul>
                        {/* <li> */}
                          {/* <Link href={`/shop/left_sidebar`}> */}
                            {/* <a> */}
                            {/* womens */}
                            {/* </a> */}
                          {/* </Link> */}
                        {/* </li> */}
                        {/* <li> */}
                          {/* <Link href={`/shop/left_sidebar`}> */}
                            {/* <a>  */}
                            {/* clothing */}
                            {/* </a> */}
                          {/* </Link> */}
                        {/* </li> */}
                        <li>
                          <Link href={`/shop/left_sidebar?category=featured`}>
                            {/* <a> */}
                            Featured
                            {/* </a> */}
                          </Link>
                        </li>
                        <li>
                          <Link href={`/shop/left_sidebar?category=trending`}>
                            {/* <a> */}
                            Trending
                            {/* </a> */}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
                <div className="sub-title">
                  <div
                    className={`footer-title ${
                      isOpen && collapse == 3 ? "active" : ""
                    } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(3);
                        } else setIsOpen(true);
                      }}>
                      why we choose
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 3 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul>
                        <li>
                          <a href="#">shipping & return</a>
                        </li>
                        <li>
                          <a href="#">secure shopping</a>
                        </li>
                        {/* <li>
                          <a href="#">gallary</a>
                        </li>
                        <li>
                          <a href="#">affiliates</a>
                        </li>
                        <li>
                          <a href="#">contacts</a>
                        </li> */}
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
              <Col>
                <div className="sub-title">
                  <div
                    className={`footer-title ${
                      isOpen && collapse == 4 ? "active" : ""
                    } `}>
                    <h4
                      onClick={() => {
                        if (width) {
                          setIsOpen(!isOpen);
                          setCollapse(4);
                        } else setIsOpen(true);
                      }}>
                      store information
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 4 ? isOpen : false) : true}>
                    <div className="footer-contant">
                      <ul className="contact-list">
                        <li>
                          <i className="fa fa-map-marker"></i>Ecowell Demo
                          Store, Demo store India 345-659
                        </li>
                        <li>
                          <i className="fa fa-phone"></i>Call Us: 123-456-7898
                        </li>
                        <li>
                          <i className="fa fa-envelope-o"></i>Email Us:{" "}
                          <a href="#">Support@Fiot.com</a>
                        </li>
                        <li>
                          <i className="fa fa-fax"></i>Fax: 123456
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CopyRight
          layout={layoutClass}
          fluid={CopyRightFluid ? CopyRightFluid : ""}
        />
      </footer>
    </div>
  );
};
export default MasterFooter;
