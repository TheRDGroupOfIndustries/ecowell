import React, { useEffect } from "react";
// import { withApollo } from "../../../helpers/apollo/apollo";
import HeaderFive from "../../../components/headers/Header-five";
import Banner from "./components/Banner";
import LogoBlocks from "../../../components/common/logo-block";
import TimeBanner from "./components/TimeBanner";
import Category from "./components/Category";
import TabProducts from "../../../components/common/Collections/TabCollection5";
import TopTrending from "../../../components/common/Collections/Collection3";
import Collection from "./components/Collection";
import ProductBox from "../../../components/common/Collections/Collection7";
import Service from "../../../components/common/Service/service2";
import { Product4 } from "../../../services/script";
import Blog from "../../../components/common/Blog/blog1";
import ModalComponent from "../../../components/common/Modal";
import Instagram from "../../../components/common/instagram/instagram2";
import Helmet from "react-helmet";
import MasterFooterThree from '../../../components/footers/common/MasterFooterThree'

const Watch = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--golden-glow", "#e4604a");
  });
  return (
    <>
      <ModalComponent />
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={"/assets/images/favicon/4.png"} />
      </Helmet>
      <HeaderFive
        logoName={"layout4/logo.png"}
        direction="left"
        topClass="top-header top-header-dark3"
      />
      <Banner />
      <div className="section-b-space">
        <LogoBlocks />
      </div>
      <TimeBanner />
      <Category />
      <TabProducts type="watch" />
      <TopTrending
        type="watch"
        innerClass="title4"
        inner="title-inner4"
        title="trending product"
        productSlider={Product4}
        designClass="ratio_asos"
        noSlider="true"
        cartClass="cart-box"
      />
      <Collection />
      <ProductBox
        type="watch"
        title="Pocket Friendly Watch For men and women"
        cartClass="cart-box"
      />
      <Blog
        type="watch"
        title="title4"
        inner="title-inner4"
        sectionClass="blog blog-bg section-b-space ratio2_3"
      />
      <Service />
      <section className="instagram ratio_square">
        <Instagram type="watch" />
      </section>
      <MasterFooterThree
        newsLetterSection={"white-layout"}
        layoutClass={"dark-subfooter"}
        footerSection={"small-section"}
        formClass={"form-inline subscribe-form classic-form"}
        belowSection={"section-b-space darken-layout"}
        logoName={"layout4/footerlogo.png"}
        myAccount={true}
        footerSectionLayout={'darken-layout'}
        newLatter={true}
      />
    </>
  );
};

export default Watch;
