import React, { useEffect, useState } from "react";
import Banner from "./layouts/Fashion/Components/Banner";
import TopCollection from "../components/common/Collections/Collection3";
import Parallax from "./layouts/Fashion/Components/Parallax";
import SpecialProducts from "../components/common/Collections/TabCollection1";
import ServiceLayout from "../components/common/Service/service1";
import Blog from "../components/common/Blog/blog1";
import Instagram from "../components/common/instagram/instagram1";
import LogoBlock from "../components/common/logo-block";
import HeaderOne from "../components/headers/header-one";
import { Product4 } from "../services/script";
import Paragraph from "../components/common/Paragraph";
import ModalComponent from "../components/common/Modal";
import Helmet from "react-helmet";
import MasterFooter from "../components/footers/common/MasterFooter";
import ShoesCategoryTwo from "./layouts/Shoes/components/Category-two";
import { toast } from "react-toastify";

const Fashion = () => {
  const logoName = document.body.classList.contains("dark")
    ? "logo.png"
    : "logo-dark.png";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products/getAllProducts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTemp = await response.json();
        console.log("Fetched Products:", dataTemp);
        setData(dataTemp);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href={"/assets/images/favicon/1.png"}
        />
      </Helmet>
      <ModalComponent />
      <HeaderOne topClass="top-header" />
      <Banner />
      <div className=" mt-5">
        <ShoesCategoryTwo title={"Categories"} />
      </div>
      <Paragraph
        title="title1 section-t-space"
        inner="title-inner1"
        hrClass={false}
        headingName="See Our Products"
        subHeadingName="special offer"
        paragraph="See all of our amazing featured products in one place. We have a fine selection of products that are sure to impress.
        "
      />
      <TopCollection
        noTitle="null"
        backImage={true}
        type="fashion"
        title="See Our Products"
        subtitle="special cdoffer"
        productSlider={Product4}
        designClass="section-b-space p-t-0 ratio_asos px-2"
        noSlider="false"
        cartClass="cart-info cart-wrap"
        loading={loading}
        data={data}
      />
      <Parallax />
      <SpecialProducts
        type="featured"
        backImage={true}
        productSlider={Product4}
        line={true}
        title="title1 section-t-space"
        inner="title-inner1"
        designClass="section-b-space p-t-0 ratio_asos"
        noSlider="true"
        cartClass="cart-info cart-wrap"
        data={data}
      />
      <ServiceLayout sectionClass="border-section small-section" />
      {/* <Blog type="fashion" title="title1" inner="title-inner1" /> */}
      {/* <Instagram type="fashion" /> */}
      <div className="section-b-space">
        <LogoBlock />
      </div>
      <MasterFooter
        footerClass={`footer-light`}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
        logoName={"logo.png"}
      />
    </>
  );
};

export default Fashion;
