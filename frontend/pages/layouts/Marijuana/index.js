import React, { Fragment, useEffect } from "react";
import HeaderTwo from "../../../components/headers/header-two";
import HomeSlider from "./component/Home-slider";
import AboutUs from "./component/About-us";
import BannerSection from "./component/Banner-section";
import Sections from "./component/Section";
// import { withApollo } from "../../../helpers/apollo/apollo";
import ProductSlider from "../../../components/common/Collections/Collection2";
import TabCollection from "../../../components/common/Collections/TabCollection9";
import BlogBanner from "../../../components/common/Blog/blog2";
import LogoBlock from "../../../components/common/logo-block";
import ModalComponent from "../../../components/common/Modal";
import { Product5 } from "../../../services/script";
import Helmet from "react-helmet";
import logof2 from "../../../public/assets/images/icon/logo/f2.png";
import MasterFooterTwo from "../../../components/footers/common/MasterFooterTwo";

const Marijuana = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--golden-glow", "#5d7227");
    document.documentElement.style.setProperty("--gradient1", "#5d7227");
    document.documentElement.style.setProperty("--gradient2", "#203f15");
  });
  return (
    <Fragment>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={"/assets/images/favicon/14.png"} />
      </Helmet>
      <ModalComponent />
      <HeaderTwo
        logoName={"logo/15.png"}
        headerClass="header-2 green-gradient"
        topClass="top-header top-header-dark"
      />
      <HomeSlider />
      <AboutUs />
      <BannerSection />
      <Sections />
      <ProductSlider
        spanClass={true}
        type="marijuana"
        subtitle="special offer"
        productSlider={Product5}
        title="new products"
        designClass="section-b-space tools-grey border-box ratio_square"
        cartClass="cart-info cart-wrap"
        noSlider={true}
      />
      <TabCollection type="marijuana" spanClass={true} />
      <BlogBanner />
      <LogoBlock designClass="bg-grey small-section" />
      <MasterFooterTwo
        footerClass="footer-5"
        logoName={logof2}
        btnGreen={true}
      />
    </Fragment>
  );
};

export default Marijuana;
