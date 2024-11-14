import React, { Fragment } from "react";
import Link from "next/link";

const LogoImage = ({ logo }) => {
  return (
    <Fragment>
      <Link href={"/"}>
        {/* <a> */}
        <img
          src={`/assets/images/icon/${logo ? logo : "logo-dark.png"}`}
          alt=""
          style={{width: "4rem", height: "4rem"}}
          className="img-fluid"
        />
        {/* </a> */}
      </Link>
    </Fragment>
  );
};

export default LogoImage;
