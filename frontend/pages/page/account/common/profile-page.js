"use client";
// import { useSession } from "next-auth/react";
import React from "react";
import { Container, Row, Form, Input, Label, Col } from "reactstrap";

const ProfilePage = () => {
  // const { data: session } = useSession();
  // const user = session?.user?.user;
  // console.log("user: ", user, session);
  return (
    <>
      <section className="contact-page register-page">
        <Container>
          <Row>
            <Col sm="12">
              <h3>PERSONAL DETAIL</h3>
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="name">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter Your name"
                      // value={user?.first_name}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Enter your last name"
                      // value={user?.last_name}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="review">
                      Phone number
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="review"
                      placeholder="Enter your number"
                      // value={user?.phone_number}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">
                      Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      // value={user?.email}
                    />
                  </Col>
                  {/* <Col md="12">
                    <Label className="form-label" for="review">
                      Write Your Message
                    </Label>
                    <textarea
                      className="form-control mb-0"
                      placeholder="Write Your Message"
                      id="exampleFormControlTextarea1"
                      rows="6"
                    ></textarea>
                  </Col> */}
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="contact-page register-page section-b-space">
        <Container>
          <Row>
            <Col sm="12">
              <h3>SHIPPING ADDRESS</h3>
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="name">
                      flat / plot
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="home-ploat"
                      placeholder="company name"
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="name">
                      Address *
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="address-two"
                      placeholder="Address"
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">
                      Zip Code *
                    </Label>
                    <Input
                      type="number"
                      className="form-control"
                      id="zip-code"
                      placeholder="zip-code"
                    />
                  </Col>
                  <Col md="6" className="select_input">
                    <Label className="form-label" for="review">
                      Country *
                    </Label>
                    <select className="form-select py-2" size="1">
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="U.K">U.K</option>
                      <option value="US">US</option>
                    </select>
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="review">
                      City *
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder="City"
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="review">
                      Region/State *
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="region-state"
                      placeholder="Region/state"
                    />
                  </Col>
                  <div className="col-md-12">
                    <button className="btn btn-sm btn-solid" type="submit">
                      Save setting
                    </button>
                  </div>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProfilePage;
