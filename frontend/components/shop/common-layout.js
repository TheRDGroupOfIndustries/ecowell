import React, { useContext } from "react";
import HeaderOne from "../headers/header-one";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import MasterFooter from "../footers/common/MasterFooter";
import Breadcrubs from "../common/widgets/breadcrubs";
import logo1 from '../../public/assets/images/icon/logo.png'
import darkLogo from '../../public/assets/images/icon/logo-dark.png'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CommonLayout = ({ children, title, parent, subTitle }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { layoutState } = useContext(SettingContext);
  // console.log("layoutState:", layoutState);
  const logoName = layoutState === "LTR" ? "dark-logo.png" : "logo.png";
  if (!session) return router.push("/");
  return (
    <>
      <HeaderOne topClass="top-header" logoName={logoName} />
      {/* <Breadcrubs title={title} parent={parent} subTitle={subTitle} /> */}
      <>{children}</>
      <MasterFooter
        footerClass={`footer-light `}
        footerLayOut={"light-layout upper-footer"}
        footerSection={"small-section border-section border-top-0"}
        belowSection={"section-b-space light-layout"}
        newLatter={true}
        logoName={logoName}
      />
    </>
  );
};

export default CommonLayout;
