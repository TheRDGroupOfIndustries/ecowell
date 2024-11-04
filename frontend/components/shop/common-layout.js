import React from "react";
import HeaderOne from "../headers/header-one";
import MasterFooter from "../footers/common/MasterFooter";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CommonLayout = ({ children, title, parent, subTitle }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // if (!session) return router.push("/");
  return (
    <>
      {/* <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href={favicon ? favicon : ""} />
      </Helmet> */}
      <HeaderOne topClass="top-header" logoName="logo.png" />
      {/* <Breadcrubs title={title} parent={parent} subTitle={subTitle} /> */}
      <>{children}</>
      <MasterFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
      />
    </>
  );
};

export default CommonLayout;
