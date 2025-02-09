import React, { Fragment, useEffect } from "react";
import HeaderOne from "../../../components/headers/header-one";
import HomeSlider from "./components/Home-slider";
import Collections from "./components/Collections";
import Paragraph from "../../../components/common/Paragraph";
import ProductSection from "../../../components/common/Collections/Collection10";
// import { withApollo } from "../../../helpers/apollo/apollo";
import ProductSlider from "../../../components/common/Collections/TabCollection7.js";
import ServiceLayout from "../../../components/common/Service/service1";
import Instagram from "../../../components/common/instagram/instagram1";
import ModalComponent from "../../../components/common/Modal";
import Helmet from "react-helmet";
import MasterParallaxBanner from "../Fashion/Components/MasterParallaxBanner";
import MasterFooter from "../../../components/footers/common/MasterFooter";

const Marketplace = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--golden-glow", "#3e5067");
  });
  return (
    <Fragment>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={"/assets/images/favicon/9.png"} />
      </Helmet>
      <ModalComponent />
      <HeaderOne logoName={"logo/18.png"} headerClass="marketplace" topClass="top-header" />
      <HomeSlider />
      <Collections />
      <Paragraph title="title1 section-t-space" inner="title-inner1" line={false} />
      <ProductSection type="marketplace" />
      <MasterParallaxBanner bg="parallax-banner28" parallaxClass="text-center p-right" title="sale" subTitle1="fashion trends" subTitle2="special offer" />
      <ProductSlider type="marketplace" />
      <ServiceLayout sectionClass={"service border-section small-section"} />
      <Instagram type="fashion" />
      <MasterFooter footerClass={`footer-light`} footerLayOut={"light-layout upper-footer"} footerSection={"small-section border-section border-top-0"} belowSection={"section-b-space light-layout"} newLatter={true} logoName={"logo/18.png"} />
    </Fragment>
  );
};

export default Marketplace;
