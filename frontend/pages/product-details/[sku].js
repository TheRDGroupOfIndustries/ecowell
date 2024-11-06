import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CommonLayout from "../../components/shop/common-layout";
import ProductSection from "./common/product_section";
import LeftSidebarPage from "./product/leftSidebarPage";

const LeftSidebar = () => {
  const router = useRouter();
  const [selectedVariantProduct, setSelectedVariantProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [sku, setSku] = useState(null);

  useEffect(() => {
    if (router.query.sku) {
      setSku(router.query.sku);
      console.log("SKU:", router.query.sku);
    }
  }, [router.query]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      console.log("Fetching product details for SKU:", sku);
      if (!sku) return;

      try {
        const response = await fetch(`/api/products/getProductBySku/${sku}`);
        const data = await response.json();
        // console.log("Product details:", data);
        setProduct(data.product);

        setSelectedVariantProduct(data.product.variants[0]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [sku]);
  return (
    <CommonLayout parent="Home" title="Product">
      {sku ? (
        <LeftSidebarPage
          selectedProduct={selectedVariantProduct}
          wholeProduct={product}
          setSelectedProduct={setSelectedVariantProduct}
        />
      ) : (
        <p>Loading...</p>
      )}
      <ProductSection
        product={product}
        selectedVariantProduct={selectedVariantProduct}
        setSelectedVariantProduct={setSelectedVariantProduct}
      />
    </CommonLayout>
  );
};

export default LeftSidebar;
