// "use client";

// import { Fragment, useEffect, useState } from "react";
// import Papa from "papaparse";
// import { Card, CardBody, Col, Container, Row } from "reactstrap";
// import { toast } from "react-toastify";
// import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
// import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
// import Datatable from "@/CommonComponents/DataTable";

// export interface ProductValues {
//   sku: string;
//   title: string;
//   new: boolean;
//   description: string;
//   category: { title: string; slug: string };
//   brand: string;
//   price: number;
//   salePrice: number;
//   discount?: number;
//   sell_on_google_quantity: number;
//   bestBefore: string;
//   directions: string[];
//   ingredients: string[];
//   benefits: string[];
//   faqs: { question: string; answer: string }[];
//   additionalInfo: {
//     manufacturedBy: string;
//     countryOfOrigin: string;
//     phone: string;
//     email: string;
//   };
//   ratings: number;
//   reviews_number: number;
//   variants: {
//     flavor: string;
//     images: string[];
//     stock: number;
//     form: "tablet" | "powder" | "liquid";
//     netQuantity: string;
//     nutritionFacts: string[];
//     allergens?: string[];
//     servingSize: string;
//   }[];
// }

// const AddMultipleProducts = () => {
//   const [productsLengthInDB, setProductsLengthInDB] = useState<number>(0);
//   const [products, setProducts] = useState<ProductValues[]>([]);
//   const [isUploading, setIsUploading] = useState(false);

//   useEffect(() => {
//     const fetchProductsLengthInDB = async () => {
//       try {
//         const res = await fetch("/api/products/get/get-products-length", {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         const data = await res.json();
//         // console.log("res data", data);

//         setProductsLengthInDB(data.count);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchProductsLengthInDB();
//   }, [productsLengthInDB]);

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.name.endsWith(".csv")) {
//       toast("Please upload a valid CSV file");
//       return;
//     }

//     setIsUploading(true);

//     try {
//       Papa.parse(file, {
//         complete: (results) => {
//           if (results.errors.length > 0) {
//             toast.error("Error parsing CSV file");
//             console.error(results.errors);
//             return;
//           }

//           const csvData = results.data as any[];
//           const headers = Object.keys(csvData[0]);
//           const requiredHeaders = [
//             "sku",
//             "title",
//             "price",
//             "brand",
//             "sell_on_google_quantity",
//           ];
//           const missingHeaders = requiredHeaders.filter(
//             (header) => !headers.includes(header)
//           );

//           if (missingHeaders.length > 0) {
//             toast.error(
//               `Missing required columns: ${missingHeaders.join(", ")}`
//             );
//             return;
//           }

//           const parsedProducts = csvData.map((row, index) => ({
//             sku: row["sku"] || "",
//             title: row["title"] || "",
//             new: row["new"] === "true",
//             description: row["description"] || "",
//             category: parseCategory(row["category"]),
//             brand: row["brand"] || "",
//             price: Number(row["price"]) || 0,
//             salePrice: Number(row["salePrice"]) || 0,
//             discount: Number(row["discount"]) || undefined,
//             sell_on_google_quantity:
//               Number(row["sell_on_google_quantity"]) || 0,
//             bestBefore: row["bestBefore"] || "",
//             directions: parseArray(row["directions"]),
//             ingredients: parseArray(row["ingredients"]),
//             benefits: parseArray(row["benefits"]),
//             faqs: parseFaqs(row["faqs"]),
//             additionalInfo: parseAdditionalInfo(row["additionalInfo"]),
//             ratings: Number(row["ratings"]) || 0,
//             reviews_number: Number(row["reviews_number"]) || 0,
//             variants: parseVariants(row["variants"]),
//           }));

//           setProducts(parsedProducts);
//         },
//         error: (error) => {
//           toast.error("Something went wrong, please reupload the file");
//           console.error(error.message);
//         },
//         header: true,
//         skipEmptyLines: true,
//         dynamicTyping: true,
//       });
//     } catch (err) {
//       toast("Failed to process file");
//       console.error(err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Helper functions to parse complex fields
//   const parseArray = (str: string): string[] => {
//     try {
//       return JSON.parse(str || "[]");
//     } catch {
//       return [];
//     }
//   };

//   const parseCategory = (str: string): { title: string; slug: string } => {
//     try {
//       return JSON.parse(str || '{"title": "", "slug": ""}');
//     } catch {
//       return { title: "", slug: "" };
//     }
//   };

//   const parseFaqs = (str: string): { question: string; answer: string }[] => {
//     try {
//       return JSON.parse(str || "[]");
//     } catch {
//       return [];
//     }
//   };

//   const parseAdditionalInfo = (str: string) => {
//     try {
//       return JSON.parse(
//         str ||
//           '{"manufacturedBy": "", "countryOfOrigin": "", "phone": "", "email": ""}'
//       );
//     } catch {
//       return { manufacturedBy: "", countryOfOrigin: "", phone: "", email: "" };
//     }
//   };

//   const parseVariants = (str: string) => {
//     try {
//       const parsed = JSON.parse(str || "[]");
//       return Array.isArray(parsed)
//         ? parsed.map((variant) => ({
//             flavor: variant.flavor || "",
//             images: variant.images || [],
//             stock: Number(variant.stock) || 0,
//             form: variant.form || "tablet",
//             netQuantity: variant.netQuantity || "",
//             nutritionFacts: variant.nutritionFacts || [],
//             allergens: variant.allergens || [],
//             servingSize: variant.servingSize || "",
//           }))
//         : [];
//     } catch {
//       return [];
//     }
//   };

//   //   console.log(products);

//   const simplifiedProducts = products?.map((product, index) => ({
//     sku: String(
//       productsLengthInDB ? productsLengthInDB + (index + 1) : index + 1
//     ).padStart(8, "0"),
//     image_link: product.variants[0]?.images[0],
//     title: product.title,
//     brand: product.brand,
//     price: product.price,
//     sell_on_google_quantity: product.sell_on_google_quantity,
//     variants_count: product.variants.length,
//   }));

//   return (
//     <Fragment>
//       <CommonBreadcrumb
//         title="Add Bulk Products"
//         parent="products/digital"
//         element={
//           <div className="d-flex gap-2 justify-content-end">
//             <div className="d-flex align-items-center gap-2 animate-slide-down">
//               <input
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileUpload}
//                 className="form-control-file"
//                 id="fileUpload"
//                 style={{ display: "none" }}
//               />
//               <label htmlFor="fileUpload" className="btn btn-primary">
//                 Upload CSV
//               </label>
//             </div>
//             {products.length > 0 && (
//               <button className="btn btn-secondary">Save</button>
//             )}
//             <button className="btn btn-danger">Cancel</button>
//           </div>
//         }
//       />
//       <Container fluid>
//         <Row className="product-adding">
//           <Col sm="12">
//             <Card>
//               <CommonCardHeader title="Product Lists" />
//               <CardBody className="pt-0">
//                 <div
//                   id="basicScenario"
//                   className="product-physical products-list"
//                 >
//                   <Datatable
//                     myData={simplifiedProducts}
//                     pageSize={5}
//                     pagination={true}
//                     class="-striped -highlight"
//                   />
//                 </div>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </Fragment>
//   );
// };

// export default AddMultipleProducts;






"use client";

import { Fragment, useEffect, useState } from "react";
import Papa from "papaparse";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { toast } from "react-toastify";
import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import CommonCardHeader from "@/CommonComponents/CommonCardHeader";
import Datatable from "@/CommonComponents/DataTable";

export interface ProductValues {
  sku: string;
  title: string;
  new: boolean;
  description: string;
  category: { title: string; slug: string };
  brand: string;
  price: number;
  salePrice: number;
  discount?: number;
  sell_on_google_quantity: number;
  bestBefore: string;
  directions: string[];
  ingredients: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  additionalInfo: {
    manufacturedBy: string;
    countryOfOrigin: string;
    phone: string;
    email: string;
  };
  ratings: number;
  reviews_number: number;
  variants: {
    flavor: string;
    images: string[];
    stock: number;
    form: "tablet" | "powder" | "liquid";
    netQuantity: string;
    nutritionFacts: string[];
    allergens?: string[];
    servingSize: string;
  }[];
}

const AddMultipleProducts = () => {
  const [productsLengthInDB, setProductsLengthInDB] = useState<number>(0);
  const [products, setProducts] = useState<ProductValues[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProductsLengthInDB = async () => {
      try {
        const res = await fetch("/api/products/get/get-products-length", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setProductsLengthInDB(data.count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductsLengthInDB();
  }, [productsLengthInDB]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast("Please upload a valid CSV file");
      return;
    }

    setIsUploading(true);

    try {
      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            toast.error("Error parsing CSV file");
            console.error(results.errors);
            return;
          }

          const csvData = results.data as any[];
          const headers = Object.keys(csvData[0]);
          const requiredHeaders = [
            "sku",
            "title",
            "price",
            "brand",
            "sell_on_google_quantity",
          ];
          const missingHeaders = requiredHeaders.filter(
            (header) => !headers.includes(header)
          );

          if (missingHeaders.length > 0) {
            toast.error(
              `Missing required columns: ${missingHeaders.join(", ")}`
            );
            return;
          }

          const parsedProducts = csvData.map((row, index) => ({
            sku: row["sku"] || "",
            title: row["title"] || "",
            new: row["new"] === "true",
            description: row["description"] || "",
            category: parseCategory(row["category"]),
            brand: row["brand"] || "",
            price: Number(row["price"]) || 0,
            salePrice: Number(row["salePrice"]) || 0,
            discount: Number(row["discount"]) || undefined,
            sell_on_google_quantity:
              Number(row["sell_on_google_quantity"]) || 0,
            bestBefore: row["bestBefore"] || "",
            directions: parseArray(row["directions"]),
            ingredients: parseArray(row["ingredients"]),
            benefits: parseArray(row["benefits"]),
            faqs: parseFaqs(row["faqs"]),
            additionalInfo: parseAdditionalInfo(row["additionalInfo"]),
            ratings: Number(row["ratings"]) || 0,
            reviews_number: Number(row["reviews_number"]) || 0,
            variants: parseVariants(row["variants"]),
          }));

          setProducts(parsedProducts);
        },
        error: (error) => {
          toast.error("Something went wrong, please reupload the file");
          console.error(error.message);
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
    } catch (err) {
      toast("Failed to process file");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper functions to parse complex fields
  const parseArray = (str: string): string[] => {
    try {
      return JSON.parse(str || "[]");
    } catch {
      return [];
    }
  };

  const parseCategory = (str: string): { title: string; slug: string } => {
    try {
      return JSON.parse(str || '{"title": "", "slug": ""}');
    } catch {
      return { title: "", slug: "" };
    }
  };

  const parseFaqs = (str: string): { question: string; answer: string }[] => {
    try {
      return JSON.parse(str || "[]");
    } catch {
      return [];
    }
  };

  const parseAdditionalInfo = (str: string) => {
    try {
      return JSON.parse(
        str ||
        '{"manufacturedBy": "", "countryOfOrigin": "", "phone": "", "email": ""}'
      );
    } catch {
      return { manufacturedBy: "", countryOfOrigin: "", phone: "", email: "" };
    }
  };

  const parseVariants = (str: string) => {
    try {
      const parsed = JSON.parse(str || "[]");
      return Array.isArray(parsed)
        ? parsed.map((variant) => ({
          flavor: variant.flavor || "",
          images: variant.images || [],
          stock: Number(variant.stock) || 0,
          form: variant.form || "tablet",
          netQuantity: variant.netQuantity || "",
          nutritionFacts: variant.nutritionFacts || [],
          allergens: variant.allergens || [],
          servingSize: variant.servingSize || "",
        }))
        : [];
    } catch {
      return [];
    }
  };

  const simplifiedProducts = products?.map((product, index) => ({
    sku: String(
      productsLengthInDB ? productsLengthInDB + (index + 1) : index + 1
    ).padStart(8, "0"),
    image_link: product.variants[0]?.images[0],
    title: product.title,
    brand: product.brand,
    price: product.price,
    sell_on_google_quantity: product.sell_on_google_quantity,
    variants_count: product.variants.length,
  }));

  const handleSaveProducts = async () => {
    try {
      const response = await fetch("/api/products/create/create-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });

      if (response.ok) {
        toast.success("Products saved successfully!");
        setProducts([]);
      } else {
        toast.error("Failed to save products");
      }
    } catch (error) {
      toast.error("An error occurred while saving products");
      console.error(error);
    }
  };

  return (
    <Fragment>
      <CommonBreadcrumb
        title="Add Bulk Products"
        parent="products/digital"
        element={
          <div className="d-flex gap-2 justify-content-end">
            <div className="d-flex align-items-center gap-2 animate-slide-down">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="form-control-file"
                id="fileUpload"
                style={{ display: "none" }}
              />
              <label htmlFor="fileUpload" className="btn btn-primary">
                Upload CSV
              </label>
            </div>
            {products.length > 0 && (
              <button onClick={handleSaveProducts} className="btn btn-secondary">
                Save
              </button>
            )}
            <button className="btn btn-danger">Cancel</button>
          </div>
        }
      />
      <Container fluid>
        <Row className="product-adding">
          <Col sm="12">
            <Card>
              <CommonCardHeader title="Product Lists" />
              <CardBody className="pt-0">
                <div
                  id="basicScenario"
                  className="product-physical products-list"
                >
                  <Datatable
                    myData={simplifiedProducts}
                    pageSize={5}
                    pagination={true}
                    class="-striped -highlight"
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

export default AddMultipleProducts;
