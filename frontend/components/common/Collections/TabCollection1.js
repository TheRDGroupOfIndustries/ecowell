import React, { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ProductItem from "../product-box/ProductBox1";
import CartContext from "../../../helpers/cart/index";
import { Container, Row, Col, Media } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import PostLoader from "../PostLoader";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import emptySearch from "../../../public/assets/images/empty-search.jpg";

const TabContent = ({
  data,
  loading,
  startIndex,
  endIndex,
  cartClass,
  backImage,
}) => {
  const context = useContext(CartContext);
  const wishListContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const quantity = context.quantity;

  return (
    <Row className="no-slider">
      {loading ? (
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
      ) : data && data.length === 0 ? (
        <Col xs="12">
          <div>
            <div className="col-sm-12 empty-cart-cls text-center">
              <Media
                src={emptySearch}
                className="img-fluid mb-4 mx-auto"
                alt=""
              />
              <h3>
                <strong>No Products Found</strong>
              </h3>
              <h4>Explore more and shortlist some items.</h4>
            </div>
          </div>
        </Col>
      ) : (
        data &&
        data.slice(startIndex, endIndex).map((product, i) => (
          <ProductItem
            key={i}
            product={product}
            symbol={currency.symbol}
            addCompare={() => compareContext.addToCompare(product)}
            addCart={() => context.addToCart(product, quantity)}
            addWishlist={() => wishListContext.addToWish(product)}
            cartClass={cartClass}
            backImage={backImage}
          />
        ))
      )}
    </Row>
  );
};

const SpecialProducts = ({
  type,
  fluid,
  designClass,
  cartClass,
  heading,
  noTitle,
  title,
  inner,
  line,
  hrClass,
  backImage,
}) => {
  const [activeTab, setActiveTab] = useState(type);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(CartContext);
  const wishListContext = useContext(WishlistContext);
  const compareContext = useContext(CompareContext);
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const quantity = context.quantity;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/categories/getProductsCategory/${activeTab}`);
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  return (
    <div>
      <section className={designClass}>
        <Container fluid={fluid}>
          {noTitle ? (
            ""
          ) : (
            <div className={title}>
              <h4>exclusive products</h4>
              <h2 className={inner}>special products</h2>
              {line ? (
                <div className="line"></div>
              ) : hrClass ? (
                <hr role="tournament6"></hr>
              ) : (
                ""
              )}
            </div>
          )}

          <Tabs className="theme-tab">
            <TabList className="tabs tab-title">
              <Tab
                className={activeTab === type ? "active" : ""}
                onClick={() => setActiveTab(type)}
              >
                Featured
              </Tab>
              <Tab
                className={activeTab === "trending" ? "active" : ""}
                onClick={() => setActiveTab("trending")}
              >
                Trending
              </Tab>
              <Tab
                className={activeTab === "festival-specials" ? "active" : ""}
                onClick={() => setActiveTab("festival-specials")}
              >
                Festival Specials
              </Tab>
            </TabList>

            <TabPanel>
              <TabContent
                data={products}
                loading={loading}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={products}
                loading={loading}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
            <TabPanel>
              <TabContent
                data={products}
                loading={loading}
                startIndex={0}
                endIndex={8}
                cartClass={cartClass}
                backImage={backImage}
              />
            </TabPanel>
          </Tabs>
        </Container>
      </section>
    </div>
  );
};

export default SpecialProducts;