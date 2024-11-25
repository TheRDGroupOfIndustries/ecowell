// import React, { useContext, useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Row, Col, Media, Modal, ModalBody, ModalHeader } from "reactstrap";
// import CartContext from "../../../helpers/cart";
// import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
// import MasterProductDetail from "./MasterProductDetail";
// import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
// import { useSession } from "next-auth/react";

// const ProductItem = ({
//   product,
//   addCart,
//   backImage,
//   des,
//   addWishlist,
//   cartClass,
//   productDetail,
//   addCompare,
//   title,
// }) => {
//   const router = useRouter();
//   const wishlistContext = useContext(WishlistContext);
//   const cartContext = useContext(CartContext);
//   // console.log("cartContext:", cartContext, product);
//   const cartItems = cartContext.state;
//   const curContext = useContext(CurrencyContext);
//   const currency = curContext.state;
//   const plusQty = cartContext.plusQty;
//   const minusQty = cartContext.minusQty;
//   const quantity = cartContext.quantity;
//   const setQuantity = cartContext.setQuantity;
// const {data: session} = useSession();
//   const [image, setImage] = useState(
//     (product.variants &&
//       product.variants[0].images &&
//       product.variants[0].images[0]) ??
//       ""
//   );

//   useEffect(() => {
//     setImage(product.variants[0].images[0]);
//   }, [product]);

//   const [modal, setModal] = useState(false);
//   const [modalCompare, setModalCompare] = useState(false);
//   const toggleCompare = () => setModalCompare(!modalCompare);
//   const toggle = () => setModal(!modal);
//   const uniqueTags = [];

//   const onClickHandle = (img) => {
//     setImage(img);
//   };

//   const changeQty = (e) => {
//     setQuantity(parseInt(e.target.value));
//   };

//   const clickProductDetail = () => {
//     console.log("product: ", product);
//     router.push(`/product-details/${product.sku}`);
//   };

//   const variantChangeByFlavor = (flavor) => {
//     const selectedVariant = product.variants.find(
//       (variant) => variant.flavor === flavor
//     );
//     if (selectedVariant) {
//       setImage(selectedVariant.images[0]);
//     }
//   };

//   if (!product.variants || !product.variants[0].images) {
//     return null;
//   }

//   return (
//     <div className="product-box product-wrap">
//       <div
//         className="img-wrapper"
//         style={{
//           cursor: "pointer",
//         }}
//       >
//         <div className="lable-block">
//           {product.new === true ? <span className="lable3">new</span> : ""}
//           {product.sale === true ? <span className="lable4">on sale</span> : ""}
//         </div>
//         <div className="front" onClick={clickProductDetail}>
//           <Media src={image} className="img-fluid" alt="" />
//         </div>
//         {backImage ? (
//           product.variants[0].images[1] === "undefined" ? (
//             "false"
//           ) : (
//             <div className="back" onClick={clickProductDetail}>
//               <Media src={image} className="img-fluid m-auto" alt="" />
//             </div>
//           )
//         ) : (
//           ""
//         )}

//         <div className={cartClass}>
//           {/* <button
//             title="Add to cart"
//             onClick={() => {
//               if(!session){
//                 console.log("session not available:", session);
//                 router.push('/page/account/login');
//                 return;
//               }
//               if (cartContext.productExistsInCart(product._id)) {
//                 console.log("product exists in cart:", product);
//                 const existedItem = cartItems.find(
//                   (item) => item.productId._id === product._id && item.variant.flavor === product.variants[0].flavor 
//                 );
//                 cartContext.removeFromCart(existedItem);
//               } else {
//                 cartContext.addToCart(product, 1, product.variants[0]);
//               }
//             }}
//           >
//             <i
//               className="fa fa-shopping-cart"
//               style={{
//                 color:
//                   cartContext.productExistsInCart(product._id) && "#399B2E",
//               }}
//               aria-hidden="true"
//             ></i>
//           </button> */}
//           <a
//             href={null}
//             title="Add to Wishlist"
//             onClick={() => {
//               if(!session){
//                 console.log("Session not available:", session);
//                 router.push('/page/account/login');
//                 return;
//               }
//               if (wishlistContext.productExistsInWishlist(product._id)) {
                
//                 wishlistContext.removeFromWish(product);
//               } else {
//                 addWishlist(product);
//               }
//             }}
//           >
//             <i
//               className="fa fa-heart"
//               style={{
//                 color:
//                   wishlistContext.productExistsInWishlist(product._id) &&
//                   "#399B2E",
//               }}
//               aria-hidden="true"
//             ></i>
//           </a>
//           <a href={null} title="Quick View" onClick={toggle}>
//             <i
//               className="fa fa-shopping-cart"
//               style={{
//                 color:
//                   cartContext.productExistsInCart(product._id) && "#399B2E",
//               }}
//               aria-hidden="true"
//             ></i>
//           </a>
//           {/* <a href={null} title="Compare" onClick={toggleCompare}>
//             <i className="fa fa-refresh" aria-hidden="true"></i>
//           </a> */}
//           <Modal
//             isOpen={modalCompare}
//             toggle={toggleCompare}
//             size="lg"
//             centered
//           >
//             <ModalBody>
//               <Row className="compare-modal">
//                 <Col lg="12">
//                   <div className="media">
//                     <Media src={image} alt="" className="img-fluid" />
//                     <div className="media-body align-self-center text-center">
//                       <h5>
//                         <i className="fa fa-check"></i>Item{" "}
//                         <span>{product.title} </span>
//                         <span> successfully added to your Compare list</span>
//                       </h5>
//                       <div className="buttons d-flex justify-content-center">
//                         <Link href="/page/compare">
//                           <button
//                             className="btn-sm btn-solid"
//                             onClick={addCompare}
//                           >
//                             View Compare list
//                           </button>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             </ModalBody>
//           </Modal>
//         </div>
//         {product.variants ? (
//           <ul className="product-thumb-list">
//             {product.variants.map((variant, i) => (
//               <li
//                 className={`grid_thumb_img ${
//                   variant.images[0] === image ? "active" : ""
//                 }`}
//                 key={i}
//               >
//                 <a
//                   href={null}
//                   title={variant.flavor}
//                   onClick={() => variantChangeByFlavor(variant.flavor)}
//                 >
//                   <Media src={variant.images[0]} alt={variant.flavor} />
//                 </a>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           ""
//         )}
//       </div>
//       <MasterProductDetail
//         product={product}
//         productDetail={productDetail}
//         currency={currency}
//         uniqueTags={uniqueTags}
//         title={title}
//         des={des}
//         variantChangeByFlavor={variantChangeByFlavor}
//       />
//       <Modal
//         isOpen={modal}
//         toggle={toggle}
//         className="modal-lg quickview-modal"
//         centered
//       >
//         <ModalBody>
//           <Row>
//             <Col lg="6" xs="12">
//               <div className="quick-view-img">
//                 <Media src={image} alt="" className="img-fluid" />
//               </div>
//             </Col>
//             <Col lg="6" className="rtl-text">
//               <div className="product-right">
//                 <button
//                   type="button"
//                   data-dismiss="modal"
//                   className="btn-close btn btn-secondary"
//                   aria-label="Close"
//                   onClick={toggle}
//                 ></button>
//                 <h2> {product.title} </h2>
//                 <h3>
//                   {currency.symbol}
//                   {(product.price * currency.value).toFixed(2)}
//                 </h3>
//                 {product.variants ? (
//                   <ul className="color-variant">
//                     {product.variants.map((variant, i) => (
//                       <li
//                         key={i}
//                         title={variant.flavor}
//                         onClick={() => variantChangeByFlavor(variant.flavor)}
//                       >
//                         {variant.flavor}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   ""
//                 )}
//                 <div className="border-product">
//                   <h6 className="product-title">product details</h6>
//                   <p>{product.description}</p>
//                 </div>
//                 <div className="product-description border-product">
//                   {product.size ? (
//                     <div className="size-box">
//                       <ul>
//                         {product.size.map((size, i) => {
//                           return (
//                             <li key={i}>
//                               <a href={null}>{size}</a>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>
//                   ) : (
//                     ""
//                   )}
//                   <h6 className="product-title">quantity</h6>
//                   <div className="qty-box">
//                     <div className="input-group">
//                       <span className="input-group-prepend">
//                         <button
//                           type="button"
//                           className="btn quantity-left-minus"
//                           onClick={minusQty}
//                           data-type="minus"
//                           data-field=""
//                         >
//                           <i className="fa fa-angle-left"></i>
//                         </button>
//                       </span>
//                       <input
//                         type="text"
//                         name="quantity"
//                         value={quantity}
//                         onChange={changeQty}
//                         className="form-control input-number"
//                       />
//                       <span className="input-group-prepend">
//                         <button
//                           type="button"
//                           className="btn quantity-right-plus"
//                           onClick={() => plusQty(product)}
//                           data-type="plus"
//                           data-field=""
//                         >
//                           <i className="fa fa-angle-right"></i>
//                         </button>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="product-buttons">
//                   <button
//                     className="btn btn-solid"
//                     onClick={() => {
//                       if (cartContext.productExistsInCart(product._id)) {
//                         const existedItem = cartItems.find(
//                           (item) => item.productId._id === product._id && item.variant.flavor === product.variants[0].flavor
//                         );

//                         cartContext.removeFromCart(existedItem);
//                       } else {
//                         cartContext.addToCart(product, 1, product.variants[0]);
//                       }
//                     }}
//                   >
//                     {cartContext.productExistsInCart(product._id)
//                       ? "remove from cart"
//                       : "add to cart"}
//                   </button>
//                   <button
//                     className="btn btn-solid"
//                     onClick={clickProductDetail}
//                   >
//                     View detail
//                   </button>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// };

// export default ProductItem;





import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Row, Col, Media, Modal, ModalBody, ModalHeader } from "reactstrap";
import CartContext from "../../../helpers/cart";
import { CurrencyContext } from "../../../helpers/Currency/CurrencyContext";
import MasterProductDetail from "./MasterProductDetail";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { useSession } from "next-auth/react";

const ProductItem = ({
  product,
  addWishlist,
  cartClass,
  productDetail,
  addCompare,
  title,
  backImage,
  des,
}) => {
  const router = useRouter();
  const wishlistContext = useContext(WishlistContext);
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const curContext = useContext(CurrencyContext);
  const currency = curContext.state;
  const setQuantity = cartContext.setQuantity;
  const { data: session } = useSession();

  // Track selected variant and its stock
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [image, setImage] = useState(
    (product.variants &&
      product.variants[0].images &&
      product.variants[0].images[0]) ??
    ""
  );
  const [quantity, setLocalQuantity] = useState(1);
  const [modal, setModal] = useState(false);
  const [modalCompare, setModalCompare] = useState(false);

  useEffect(() => {
    if (product.variants && product.variants[0]) {
      setImage(product.variants[0].images[0]);
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const toggleCompare = () => setModalCompare(!modalCompare);
  const toggle = () => setModal(!modal);

  const changeQty = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= selectedVariant.stock) {
      setLocalQuantity(value);
      setQuantity(value);
    }
  };

  const plusQty = () => {
    if (quantity < selectedVariant.stock) {
      const newQty = quantity + 1;
      setLocalQuantity(newQty);
      setQuantity(newQty);
    }
  };

  const minusQty = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setLocalQuantity(newQty);
      setQuantity(newQty);
    }
  };

  const clickProductDetail = () => {
    router.push(`/product-details/${product.sku}`);
  };

  const variantChangeByFlavor = (flavor) => {
    const newSelectedVariant = product.variants.find(
      (variant) => variant.flavor === flavor
    );
    if (newSelectedVariant) {
      setSelectedVariant(newSelectedVariant);
      setImage(newSelectedVariant.images[0]);

      // Check if this variant is in cart and set appropriate quantity
      const existingCartItem = cartItems.find(
        (item) =>
          item.productId._id === product._id &&
          item.variant.flavor === flavor
      );

      const newQuantity = existingCartItem ?
        Math.min(existingCartItem.quantity, newSelectedVariant.stock) :
        Math.min(1, newSelectedVariant.stock);

      setLocalQuantity(newQuantity);
      setQuantity(newQuantity);
    }
  };

  // Check if current variant exists in cart
  const variantExistsInCart = () => {
    return cartItems.some(
      item =>
        item.productId._id === product._id &&
        item.variant.flavor === selectedVariant.flavor
    );
  };

  if (!product.variants || !product.variants[0].images) {
    return null;
  }

  return (
    <div className="product-box product-wrap">
      <div className="img-wrapper" style={{ cursor: "pointer" }}>
        <div className="lable-block">
          {product.new === true ? <span className="lable3">new</span> : ""}
          {product.sale === true ? <span className="lable4">on sale</span> : ""}
        </div>
        <div className="front" onClick={clickProductDetail}>
          <Media src={image} className="img-fluid" alt="" />
        </div>
        {backImage ? (
          product.variants[0].images[1] === "undefined" ? (
            "false"
          ) : (
            <div className="back" onClick={clickProductDetail}>
              <Media src={image} className="img-fluid m-auto" alt="" />
            </div>
          )
        ) : (
          ""
        )}

        <div className={cartClass}>
          <a
            href={null}
            title="Add to Wishlist"
            onClick={() => {
              if (!session) {
                router.push('/page/account/login');
                return;
              }
              if (wishlistContext.productExistsInWishlist(product._id)) {
                wishlistContext.removeFromWish(product);
              } else {
                addWishlist(product);
              }
            }}
          >
            <i
              className="fa fa-heart"
              style={{
                color: wishlistContext.productExistsInWishlist(product._id) && "#D4A017",
              }}
              aria-hidden="true"
            ></i>
          </a>
          <a href={null} title="Quick View" onClick={toggle}>
            <i
              className="fa fa-shopping-cart"
              style={{
                color: variantExistsInCart() && "#D4A017",
              }}
              aria-hidden="true"
            ></i>
          </a>
        </div>

        {product.variants ? (
          <ul className="product-thumb-list">
            {product.variants.map((variant, i) => (
              <li
                className={`grid_thumb_img ${variant.images[0] === image ? "active" : ""
                  }`}
                key={i}
              >
                <a
                  href={null}
                  title={`${variant.flavor} (Stock: ${variant.stock})`}
                  onClick={() => variantChangeByFlavor(variant.flavor)}
                >
                  <Media src={variant.images[0]} alt={variant.flavor} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          ""
        )}
      </div>

      <MasterProductDetail
        product={product}
        productDetail={productDetail}
        currency={currency}
        uniqueTags={[]}
        title={title}
        des={des}
        variantChangeByFlavor={variantChangeByFlavor}
      />

      <Modal
        isOpen={modal}
        toggle={toggle}
        className="modal-lg quickview-modal"
        centered
      >
        <ModalBody>
          <Row>
            <Col lg="6" xs="12">
              <div className="quick-view-img">
                <Media src={image} alt="" className="img-fluid" />
              </div>
            </Col>
            <Col lg="6" className="rtl-text">
              <div className="product-right">
                <button
                  type="button"
                  className="btn-close btn btn-secondary"
                  onClick={toggle}
                ></button>
                <h2>{product.title}</h2>
                <h3>
                  {currency.symbol}
                  {(product.price * currency.value).toFixed(2)}
                </h3>

                {product.variants && (
                  <div className="variant-section mb-3">
                    <h6 className="product-title">Select Flavor</h6>
                    <ul className="color-variant" style={{display:"flex",alignItems:"center",flex:'row',gap:'20px',padding:'2px',border:'1px',borderColor:'#fffff',borderRadius:'10px'}}>
                      {product.variants.map((variant, i) => (
                        <li
                          key={i}
                          title={`${variant.flavor} (Stock: ${variant.stock})`}
                          onClick={() => variantChangeByFlavor(variant.flavor)}
                          className={selectedVariant.flavor === variant.flavor ? "active" : ""}
                          style={{
                            cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
                            opacity: variant.stock === 0 ? 0.5 : 1
                          }}
                        >
                          {variant.flavor}
                          {variant.stock === 0 && <span className="out-of-stock"> (Out of Stock)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-product">
                  <h6 className="product-title">Product Details</h6>
                  <p>{product.description}</p>
                  {/* <p className="stock-info">
                    Available Stock: {selectedVariant.stock}
                  </p> */}
                </div>

                <div className="product-description border-product">
                  <h6 className="product-title">Quantity</h6>
                  <div className="qty-box">
                    <div className="input-group">
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-left-minus"
                          onClick={minusQty}
                          disabled={quantity <= 1}
                        >
                          <i className="fa fa-angle-left"></i>
                        </button>
                      </span>
                      <input
                        type="number"
                        name="quantity"
                        value={quantity}
                        onChange={changeQty}
                        className="form-control input-number"
                        min="1"
                        max={selectedVariant.stock}
                      />
                      <span className="input-group-prepend">
                        <button
                          type="button"
                          className="btn quantity-right-plus"
                          onClick={plusQty}
                          disabled={quantity >= selectedVariant.stock}
                        >
                          <i className="fa fa-angle-right"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-buttons">
                  <button
                    className="btn btn-solid"
                    onClick={() => {
                      if (!session) {
                        router.push('/page/account/login');
                        return;
                      }

                      if (variantExistsInCart()) {
                        const existedItem = cartItems.find(
                          (item) =>
                            item.productId._id === product._id &&
                            item.variant.flavor === selectedVariant.flavor
                        );
                        cartContext.removeFromCart(existedItem);
                      } else {
                        if (selectedVariant.stock > 0) {
                          cartContext.addToCart(product, quantity, selectedVariant);
                        }
                      }
                    }}
                    disabled={selectedVariant.stock === 0}
                  >
                    {selectedVariant.stock === 0
                      ? "Out of Stock"
                      : variantExistsInCart()
                        ? "Remove from Cart"
                        : "Add to Cart"}
                  </button>
                  <button
                    className="btn btn-solid"
                    onClick={clickProductDetail}
                  >
                    View Detail
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductItem;