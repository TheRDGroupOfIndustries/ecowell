import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Col, Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody, Collapse } from "reactstrap";
import classnames from 'classnames';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductInformation = ({ product, selectedFlavor, setSelectedFlavor }: any) => {
  const flavors = product.variants.map((variant: any) => variant.flavor);
  const [rating, setRating] = useState<number>(1);
  const [activeTab, setActiveTab] = useState('1');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const onStarClick = (nextValue: number) => {
    setRating(nextValue);
  };

  return (
    <Col xl="8">
      <div className="product-page-details product-right mb-0">
        <h2>{product.title}</h2>
        {/* <div style={{ fontSize: 27, height: 31 }}>
          <ReactStars count={5} onChange={onStarClick} size={40} activeColor="#ffd700" value={rating} />
        </div> */}
        <hr />
        <h5 className="product-title">Product Details</h5>
        <p>{product.description}</p>
        <h5 className="product-title">Product Category</h5>
        <p>{product.category.title}</p>
        <div className="product-price digits mt-2">
          <h3>
            ₹{product.price} <del>{product.salePrice ? `₹${product.salePrice}` : ""}</del>
          </h3>
        </div>

        <h5 className="product-title size-text">Select Flavor</h5>
        <div className="">
          <ul>
            {flavors.map((flavor: string, index: number) => (
              <li
                key={index}
                onClick={() => setSelectedFlavor(product.variants[index])}
                className={`${selectedFlavor && selectedFlavor.flavor === flavor ? "activeFlavourInstance" : ""} flavourInstance`}
              >
                <a>{flavor}</a>
              </li>
            ))}
          </ul>
        </div>

        {selectedFlavor && (
          <>
            <h5 className="product-title">Flavor Details</h5>
            <p><strong>Stock:</strong> {selectedFlavor.stock}</p>
            <p><strong>Form:</strong> {selectedFlavor.form}</p>
            <p><strong>Net Quantity:</strong> {selectedFlavor.netQuantity}</p>
            <p><strong>Serving Size:</strong> {selectedFlavor.servingSize}</p>
            <p><strong>Best Before: </strong>
              {new Date(product.bestBefore).toLocaleDateString()}
            </p>
          </>
        )}

        <Nav tabs>
          {['Benefits', 'Ingredients', 'Nutrition Facts', 'Additional Info', 'Allergens'].map((tabLabel, index) => (
            <NavItem key={index}>
              <NavLink
                className={classnames({ active: activeTab === `${index + 1}` })}
                onClick={() => { toggleTab(`${index + 1}`); }}
                style={{ cursor: 'pointer', padding: '10px 20px', }}
              >
                {tabLabel}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Card>
              <CardBody>
                <ul className={"detailsList"}>{product.benefits.map((benefit: string, index: number) => <li key={index}>{benefit}</li>)}</ul>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card>
              <CardBody>
                <ul className={"detailsList"}>{product.ingredients.map((ingredient: string, index: number) => <li key={index}>{ingredient}</li>)}</ul>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="3">
            <Card>
              <CardBody>
                <ul className={"detailsList"}>{selectedFlavor ? selectedFlavor.nutritionFacts.map((fact: string, index: number) => <li key={index}>{fact}</li>) : "No Nutrition Facts available"}</ul>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="4">
            <Card>
              <CardBody>
                <p><strong>Best Before:</strong> {new Date(product.bestBefore).toLocaleDateString()}</p>
                <p><strong>Directions:</strong> {product.directions.join(", ")}</p>
                <p><strong>Manufactured By:</strong> {product.additionalInfo.manufacturedBy}</p>
                <p><strong>Country of Origin:</strong> {product.additionalInfo.countryOfOrigin}</p>
                <p><strong>Phone:</strong> {product.additionalInfo.phone}</p>
                <p><strong>Email:</strong> {product.additionalInfo.email}</p>
              </CardBody>
            </Card>
          </TabPane>
          <TabPane tabId="5">
            <Card>
              <CardBody>
                <ul className={"detailsList"}>{selectedFlavor ? selectedFlavor.allergens.map((allergen: string, index: number) => <li key={index}>{allergen}</li>) : "No Allergens available"}</ul>
              </CardBody>
            </Card>
          </TabPane>
        </TabContent>

        <h5 className="product-title">FAQs</h5>
        <div className="d-flex mt-4 flex-column gap-2">
        {product.faqs.map((faq: any, index: number) => (
          <div key={index} style={{
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '5px',
          }}>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <h6 onClick={() => toggleFaq(index)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center', width:'95%', fontSize:'16px', color:"#000" }}>
                {faq.question}
              </h6>
                {faqOpen === index ? <FaChevronUp style={{ marginLeft: '8px' }} /> : <FaChevronDown style={{ marginLeft: '8px' }} />}
              </div>
            <Collapse isOpen={faqOpen === index}>
              <p style={{fontSize:"14px"}}>{faq.answer}</p>
            </Collapse>
          </div>
        ))}
        </div>
      </div>
    </Col>
  );
};

export default ProductInformation;
