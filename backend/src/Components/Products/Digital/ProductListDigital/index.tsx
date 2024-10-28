import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";
import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import axios from 'axios';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { image } from "@uiw/react-md-editor";

const ProductListDigital = () => {
  const [ProductListDigitalData, setProductListDigitalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/products/get/get-all-products');
        console.log("Fetched Products:", response.data);
        const transformedData = response.data.map((product:any) => ({
          sku: product.sku,
          image_link: product.variants[0].images[0],
          title: product.title,
          brand: product.brand,
          price: product.price,
          category_slug: product.category.slug,
          sell_on_google_quantity: product.sell_on_google_quantity,
          variants_count: product.variants.length,
        }));
        setProductListDigitalData(transformedData);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Fragment>
      <CommonBreadcrumb title="Product List" parent="Digital" />
      <Container fluid>
        <Row>
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Lists" />
              <CardBody className="pt-0">
                <div className="clearfix"></div>
                <div id="basicScenario" className="product-physical products-list">
                  <Datatable
                    multiSelectOption={false}
                    myData={ProductListDigitalData}
                    pageSize={9}
                    pagination={false}
                    class="-striped -highlight"
                    isDelete={true}
                    onClickField={"sku"}
                    loading={loading}
                    handleOnClick={(sku: string, category_slug:string) => {
                      console.log("Clicked SKU:", sku);
                      router.push(`/en/products/digital/product-detail/${category_slug}/${sku}`);
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ProductListDigital;