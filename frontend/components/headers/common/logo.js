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
          // style={{width: "3rem", height: "3rem"}}
          className="img-fluid"
        />
        {/* </a> */}
      </Link>
    </Fragment>
  );
};

export default LogoImage;
