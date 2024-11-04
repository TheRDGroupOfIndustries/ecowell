import React from "react";
import HeaderOne from "../headers/header-one";
import MasterFooter from "../footers/common/MasterFooter";
import Breadcrubs from "../common/widgets/breadcrubs";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

const CommonLayout = ({ children, title, parent, subTitle }) => {
  // const { data: session } = useSession();
  // const router = useRouter();

  // if (!session) return router.push("/");
  return (
    <>
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
