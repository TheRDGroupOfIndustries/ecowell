import React from "react";

const MasterProductDetail = ({
  product,
  productDetail,
  currency,
  uniqueTags,
  detailClass,
  title,
  des,
  variantChangeByFlavor,
}) => {
  let RatingStars = [];
  let rating = 5;
  for (var i = 0; i < rating; i++) {
    RatingStars.push(<i className="fa fa-star" key={i}></i>);
  }

  return (
    <div className={`product-detail ${productDetail} ${detailClass}`}>
      <div>
        {title !== "Product style 4" ? (
          <div className="rating">{RatingStars}</div>
        ) : (
          ""
        )}
        <h6>{product.title}</h6>
        {des ? <p>{product.description}</p> : ""}
        <h4>
          {currency.symbol}
          {product.salePrice ? product.salePrice : product.price}
          {product.salePrice ? (
          <del>
            <span className="money">
              {currency.symbol}
              {product.price}
              </span>
            </del>
          ) : (
            ""
          )}
        </h4>

        {product.variants.map((vari) => {
          var findItem = uniqueTags.find((x) => x.flavor === vari.flavor);
          if (!findItem) uniqueTags.push(vari);
        })}

        {product.type === "jewellery" ||
        product.type === "nursery" ||
        product.type === "beauty" ||
        product.type === "electronics" ||
        product.type === "goggles" ||
        product.type === "watch" ||
        product.type === "pets" ? (
          ""
        ) : (
          <>
            {title !== "Product style 4" && uniqueTags[0].flavor ? (
              <ul className="mt-2 d-flex flex-row gap-2 flavourItems">
                {uniqueTags.map((vari, i) => {
                  return (
                    <li
                      style={{
                        // padding: "0.3rem 0.5rem";
                        // border: "0.5px solid #5b5b5b";
                        // borderRadius: "5px";
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        padding: "0.3rem 0.5rem",
                        border: "0.5px solid #5b5b5b",
                        borderRadius: "5px",
                      }}
                      key={i}
                      title={vari.flavor}
                      onClick={() => variantChangeByFlavor(vari.flavor)}
                    >
                      {vari.flavor}
                    </li>
                  );
                })}
              </ul>
            ) : (
              ""
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MasterProductDetail;
