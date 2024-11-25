// import React, { useState } from "react";
// import SettingContext from "./SettingContext";
// import config from "../../components/customizer/config.json";

// const SettingProvider = (props) => {
//   const [layoutState, setLayoutState] = useState("RTL");
//   const [layoutColor, setLayoutColor] = useState("#399B2E");
//   const layoutFun = (item) => {
//     if (item === "RTL") {
//       document.body.classList.remove("ltr");
//       document.body.classList.add("rtl");
//       setLayoutState("LTR");
//     } else {
//       document.body.classList.remove("rtl");
//       document.body.classList.add("ltr");
//       setLayoutState("RTL");
//     }
//   };

//   // console.log("layoutState",layoutState)

//   const layoutColorFun = (item) => {
//     document.documentElement.style.setProperty(
//       "--golden-glow",
//       item.target.value
//     );
//     config.color = item.target.value;
//     localStorage.setItem("color", item.target.value);
//     setLayoutColor(item.target.value);
//   };

//   return (
//     <SettingContext.Provider
//       value={{
//         ...props,
//         layoutState,
//         layoutColor,
//         layoutFun: layoutFun,
//         layoutColorFun: layoutColorFun,
//       }}
//     >
//       {props.children}
//     </SettingContext.Provider>
//   );
// };

// export default SettingProvider;


// SettingProvider.js
import React, { useState } from "react";
import SettingContext from "./SettingContext";
import config from "../../components/customizer/config.json";

const SettingProvider = (props) => {
  const [layoutState, setLayoutState] = useState("RTL");
  const [layoutColor, setLayoutColor] = useState("#399B2E");
  const [logo, setLogo] = useState("logo.png"); // Default logo

  const layoutFun = (item) => {
    if (item === "RTL") {
      document.body.classList.remove("ltr");
      document.body.classList.add("rtl");
      setLayoutState("LTR");
    } else {
      document.body.classList.remove("rtl");
      document.body.classList.add("ltr");
      setLayoutState("RTL");
    }
  };

  const layoutColorFun = (item) => {
    document.documentElement.style.setProperty(
      "--golden-glow",
      item.target.value
    );
    config.color = item.target.value;
    localStorage.setItem("color", item.target.value);
    setLayoutColor(item.target.value);
  };

  const setThemeLogo = (logoName) => {
    setLogo(logoName);
  };

  return (
    <SettingContext.Provider
      value={{
        layoutState,
        layoutColor,
        layoutFun,
        layoutColorFun,
        logo,
        setThemeLogo,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;