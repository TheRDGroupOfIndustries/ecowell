// import React, { useContext } from "react";
// import { useQuery } from "@apollo/client";
// import { gql } from "@apollo/client";
// import { Media } from "reactstrap";
// import Slider from "react-slick";
// import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";

// const GET_PRODUCTS = gql`
//   query newProducts($type: String!) {
//     newProducts(type: $type) {
//       title
//       price
//       images {
//         alt
//         src
//       }
//     }
//   }
// `;

// const NewProduct = () => {
//   const CurContect = useContext(CurrencyContext);
//   const symbol = CurContect.state.symbol;
//   var { loading, data } = useQuery(GET_PRODUCTS, {
//     variables: {
//       type: "fashion",
//     },
//   });

//   return (
//     // <!-- side-bar single product slider start -->
//     <div className="theme-card">
//       <h5 className="title-border">new product</h5>
//       <Slider className="offer-slider slide-1">
//         <div>
//           {!data ||
//           !data.newProducts ||
//           data.newProducts.length === 0 ||
//           loading ? (
//             "loading"
//           ) : (
//             <>
//               {data &&
//                 data.newProducts.slice(0, 3).map((product, index) => (
//                   <div className="media" key={index}>
//                     <a href="">
//                       <Media
//                         className="img-fluid blur-up lazyload"
//                         src={product.images[0].src}
//                         alt={product.images[0].alt}
//                       />
//                     </a>
//                     <div className="media-body align-self-center">
//                       <div className="rating">
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>
//                       </div>
//                       <a href={null}>
//                         <h6>{product.title}</h6>
//                       </a>
//                       <h4>
//                         {symbol}
//                         {product.price}
//                       </h4>
//                     </div>
//                   </div>
//                 ))}
//             </>
//           )}
//         </div>
//         <div>
//           {!data ||
//           !data.newProducts ||
//           data.newProducts.length === 0 ||
//           loading ? (
//             "loading"
//           ) : (
//             <>
//               {data &&
//                 data.newProducts.slice(4, 7).map((product, index) => (
//                   <div className="media" key={index}>
//                     <a href="">
//                       <Media
//                         className="img-fluid blur-up lazyload"
//                         src={product.images[0].src}
//                         alt={product.images[0].alt}
//                       />
//                     </a>
//                     <div className="media-body align-self-center">
//                       <div className="rating">
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>{" "}
//                         <i className="fa fa-star"></i>
//                       </div>
//                       <a href={null}>
//                         <h6>{product.title}</h6>
//                       </a>
//                       <h4>
//                         {symbol}
//                         {product.price}
//                       </h4>
//                     </div>
//                   </div>
//                 ))}
//             </>
//           )}
//         </div>
//       </Slider>
//     </div>
//     //  <!-- side-bar single product slider end -->
//   );
// };

// export default NewProduct;

import React, { useContext, useEffect, useState } from "react";
import { Media } from "reactstrap";
import Slider from "react-slick";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";

const NewProduct = () => {
  const CurContext = useContext(CurrencyContext);
  const symbol = CurContext.state.symbol;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch("/api/products/newProduct"); // Adjust the URL based on your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  return (
    // <!-- side-bar single product slider start -->
    <div className="theme-card">
      <h5 className="title-border">New Products</h5>
      <Slider className="offer-slider slide-1">
        <div>
          {loading ? (
            "Loading..."
          ) : error ? (
            <div>Error fetching products: {error.message}</div>
          ) : (
            <>
              {data && data.length > 0 ? (
                data.slice(0, 3).map((product, index) => (
                  <div className="media" key={index}>
                    <a href="">
                      <Media
                        className="img-fluid blur-up lazyload"
                        src={product.variants[0].images[0]} // Adjust based on your data structure
                        alt={product.variants[0].images[0].alt} // Adjust based on your data structure
                      />
                    </a>
                    <div className="media-body align-self-center">
                      <div className="rating">
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>
                      </div>
                      <a href={null}>
                        <h6>{product.title}</h6>
                      </a>
                      <h4>
                        {symbol}
                        {product.price}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <div>No new products available.</div>
              )}
            </>
          )}
        </div>
        <div>
          {loading ? (
            "Loading..."
          ) : error ? (
            <div>Error fetching products: {error.message}</div>
          ) : (
            <>
              {data && data.length > 0 ? (
                data.slice(3, 6).map((product, index) => (
                  <div className="media" key={index}>
                    <a href="">
                      <Media
                        className="img-fluid blur-up lazyload"
                        src={product.variants[0].images[0]} // Adjust based on your data structure
                        alt={product.variants[0].images[0].alt} // Adjust based on your data structure
                      />
                    </a>
                    <div className="media-body align-self-center">
                      <div className="rating">
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>{" "}
                        <i className="fa fa-star"></i>
                      </div>
                      <a href={null}>
                        <h6>{product.title}</h6>
                      </a>
                      <h4>
                        {symbol}
                        {product.price}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <div>No new products available.</div>
              )}
            </>
          )}
        </div>
      </Slider>
    </div>
    //  <!-- side-bar single product slider end -->
  );
};

export default NewProduct;
