import React, { useContext } from "react";
import HeaderOne from "../headers/header-one";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import MasterFooter from "../footers/common/MasterFooter";
import Breadcrubs from "../common/widgets/breadcrubs";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

const CommonLayout = ({ children, title, parent, subTitle }) => {
  // const { data: session } = useSession();
  // const router = useRouter();
  const { layoutState, logo } = useContext(SettingContext);
  console.log("layoutState:", layoutState);
  console.log("logoName:", logo);
  // const logoName = layoutState === "LTR" ? "logo-dark.png" : "logo.png";
  // if (!session) return router.push("/");
  return (
    <>
      <HeaderOne topClass="top-header" logoName={logo} />
      {/* <Breadcrubs title={title} parent={parent} subTitle={subTitle} /> */}
      <>{children}</>
      <MasterFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
        logoName={logo}
      />
    </>
  );
};

export default CommonLayout;
