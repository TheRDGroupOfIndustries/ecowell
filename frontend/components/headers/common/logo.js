import React, { Fragment } from "react";
import Link from "next/link";

const LogoImage = ({ logo }) => {
  return (
    <Fragment>
      <Link href={"/"}>
        <div className="logo-image" />
      </Link>
    </Fragment>
  );
};

export default LogoImage;