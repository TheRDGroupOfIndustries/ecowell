import React, { useState, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useQuery } from "@apollo/client";
import { gql } from '@apollo/client';
import ProductItem from "../product-box/ProductBox1";
import CartContext from "../../../helpers/cart/index";
import { Container, Row, Col } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import PostLoader from "../PostLoader";
import { CompareContext } from "../../../helpers/Compare/CompareContext";

const GET_PRODUCTS = gql`
  query products($type: _CategoryType!, $indexFrom: Int!, $limit: Int!) {
    products(type: $type, indexFrom: $indexFrom, limit: $limit) {
      items {
        id
        title
        description
        type
        brand
        category
        price
        stock
        new
        sale
        discount
        variants {
          id
          sku
          size
          color
          image_id
        }
        images {
          image_id
          id
          alt
          src
        }
      }
    }
  }
`;

const TabContent = ({ data, loading, cartClass, startIndex, endIndex }) => {
  const context = useContext(CartContext);
  const wishListContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const quantity = context.quantity;

  return (
    <>
      <Row className="no-slider">
        {!data ||
        !data.products ||
        !data.products.items ||
        data.products.items.length === 0 ||
        loading ? (
          data &&
          data.products &&
          data.products.items &&
          data.products.items.length === 0 ? (
            <Col xs="12">
              <div>
                <div className="col-sm-12 empty-cart-cls text-center">
                  <img
                    src={`/static/images/empty-search.jpg`}
                    className="img-fluid mb-4 mx-auto"
                    alt=""
                  />
                  <h3>
                    <strong>Your Cart is Empty</strong>
                  </h3>
                  <h4>Explore more shortlist some items.</h4>
                </div>
              </div>
            </Col>
          ) : (
            <div className="row mx-0 margin-default">
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
            </div>
          )
        ) : (
          data &&
          data.products.items
            .slice(0, 8)
            .map((product, i) => (
              <ProductItem
                product={product}
                key={i}
                addCompare={() => compareContext.addToCompare(product)}
                addCart={() =>context.addToCart(product, quantity, product.variants[0])}
                addWishlist={() => wishListContext.addToWish(product)}
                cartClass={cartClass}
              />
            ))
        )}
      </Row>
    </>
  );
};

const SpecialProducts = ({ type, designClass, cartClass, noTitle }) => {
  const [activeTab, setActiveTab] = useState(type);
  const context = useContext(CartContext);
  const wishListContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const quantity = context.quantity;

  var { loading, data } = useQuery(GET_PRODUCTS, {
    variables: {
      type: activeTab,
      indexFrom: 0,
      limit: 8,
    },
  });

  return (
    <div>
      {noTitle ? (
        ""
      ) : (
        <div className="title1 section-t-space">
          <h4>exclusive products</h4>
          <h2 className="title-inner1">special products</h2>
        </div>
      )}

      <section className={designClass}>
        <Container>
          <Tabs className="theme-tab">
            <TabList className="tabs tab-title">
              <Tab
                className={activeTab == type ? "active" : ""}
                onClick={() => setActiveTab(type)}
              >
                NEW ARRIVAL
              </Tab>
              <Tab
                className={activeTab == "furniture" ? "active" : ""}
                onClick={() => setActiveTab("furniture")}
              >
                FEATURED{" "}
              </Tab>
              <Tab
                className={activeTab == "furniture" ? "active" : ""}
                onClick={() => setActiveTab("furniture")}
              >
                SPECIAL
              </Tab>
            </TabList>

            <TabPanel>
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                startIndex={0}
                endIndex={8}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                startIndex={0}
                endIndex={8}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={data}
                loading={loading}
                cartClass={cartClass}
                startIndex={0}
                endIndex={8}
              />
            </TabPanel>
          </Tabs>
        </Container>
      </section>
    </div>
  );
};

export default SpecialProducts;
