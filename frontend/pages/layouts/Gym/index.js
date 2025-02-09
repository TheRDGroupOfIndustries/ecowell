import React, { Fragment, useEffect } from "react";
import HeaderNine from "../../../components/headers/header-nine";
import HomeSlider from "./component/Home-slider";
import BannerSection from "./component/Banner-section";
import TopCollection from "../../../components/common/Collections/Collection14";
import ProductSlider from "../../../components/common/Collections/Collection1";
import Blog from "../../../components/common/Blog/blog1";
import Instagram from "../../../components/common/instagram/instagram2";
import LogoBlock from "../../../components/common/logo-block";
import Paragraph from "../../../components/common/Paragraph";
import ModalComponent from "../../../components/common/Modal";
import Helmet from "react-helmet";
import MasterFooterTwo from "../../../components/footers/common/MasterFooterTwo";

const Gym = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--golden-glow", "#01effc");
    document.documentElement.style.setProperty("--gradient1", "#01effc");
    document.documentElement.style.setProperty("--gradient2", "#485ff2");
  });
  return (
    <Fragment>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={"/assets/images/favicon/13.png"} />
      </Helmet>
      <ModalComponent />
      <HeaderNine
        logoName={"logo/f6.png"}
        topClass="top-header top-header-dark2"
      />
      <HomeSlider />
      <BannerSection />
      <TopCollection
        type="gym"
        title="Top Collections"
        subtitle="special offer"
        designClass="p-t-0 section-b-space partition-cls gym-product ratio_square"
        cartClass="cart-info cart-wrap"
        noSlider="false"
      />
      <div className="full-banner gym-parallax parallax-banner25 p-0 ratio_square">
        <Paragraph
          title="title1 section-t-space"
          inner="title-inner1"
          hrClass={false}
        />
        <ProductSlider
          type="gym"
          designClass="p-t-0 section-b-space gym-product ratio_square"
          cartClass="cart-info cart-wrap"
          noSlider="false"
        />
      </div>
      <Blog
        type="gym"
        sectionClass="pt-0 section-b-space gym-blog ratio3_2"
        title="title1  title-gradient section-t-space"
        inner="title-inner1"
      />
      <div className="full-banner gym-parallax parallax-banner26 p-0 ratio_square">
        <div className="section-b-space section-t-space">
          <Instagram type="gym" />
        </div>
      </div>
      <div className="section-b-space">
        <LogoBlock />
      </div>
      <MasterFooterTwo
        footerClass={"bg-img-gym bg-size blur-up lazyloaded"}
        footerSection=" border-b"
        footerLogoClass="text-center"
        logoName={"logo/f6.png"}
        logoImg={true}
        myAccount={true}
        layoutClass={"darker-subfooter"}
      />
    </Fragment>
  );
};

export default Gym;
