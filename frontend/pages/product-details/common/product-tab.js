import React, { useState } from "react";
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

const ProductTab = ({ wholeProduct }) => {
  const [activeTab, setActiveTab] = useState("1");

  if (!wholeProduct) {
    return <p>Loading...</p>;
  }

  return (
    <section className="tab-product m-0">
      <Container>
        <Row>
          <Col sm="12" lg="12">
            <Row className="product-page-main m-0">
              <Nav tabs className="nav-material">
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "1" ? "active" : ""} onClick={() => setActiveTab("1")}>
                    Benefits
                  </NavLink>
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "2" ? "active" : ""} onClick={() => setActiveTab("2")}>
                    Directions
                  </NavLink>
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "3" ? "active" : ""} onClick={() => setActiveTab("3")}>
                    Ingredients
                  </NavLink>
                </NavItem>
                <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                  <NavLink className={activeTab === "4" ? "active" : ""} onClick={() => setActiveTab("4")}>
                    Additional Info
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="nav-material product-tabs">
                <TabPane tabId="1">
                  <ul>
                    {wholeProduct.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </TabPane>
                <TabPane tabId="2">
                  <ul>
                    {wholeProduct.directions.map((direction, index) => (
                      <li key={index}>{direction}</li>
                    ))}
                  </ul>
                </TabPane>
                <TabPane tabId="3">
                  <ul>
                    {wholeProduct.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </TabPane>
                <TabPane tabId="4">
                  <ul>
                    <li>Manufactured By: {wholeProduct.additionalInfo.manufacturedBy}</li>
                    <li>Country of Origin: {wholeProduct.additionalInfo.countryOfOrigin}</li>
                    <li>Phone: {wholeProduct.additionalInfo.phone}</li>
                    <li>Email: {wholeProduct.additionalInfo.email}</li>
                  </ul>
                </TabPane>
              </TabContent>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductTab;