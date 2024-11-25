// import React, { useEffect, useState, useContext } from "react";
// import SettingContext from "../../helpers/theme-setting/SettingContext";
// import config from "./config.json";

// const ThemeSettings = () => {
//   const context = useContext(SettingContext);
//   const [themeLayout, setThemeLayout] = useState(true); // set to true for dark mode
//   const layoutState = context.layoutState;

//   /*=====================
//      Tap on Top
//      ==========================*/
//   useEffect(() => {
//     if (config.config.layout_version && config.config.layout_type) {
//       const bodyClass = document.body.classList;
//       document.body.className = `${bodyClass} ${config.config.layout_version}  ${config.config.layout_type}`;
//     }

//     if (localStorage.getItem("color")) {
//       document.documentElement.style.setProperty(
//         "--golden-glow",
//         localStorage.getItem("color")
//       );
//     }

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleScroll = () => {
//     if (process.browser) {
//       if (document.documentElement.scrollTop > 600) {
//         document.querySelector(".tap-top").style = "display: block";
//       } else {
//         document.querySelector(".tap-top").style = "display: none";
//       }
//     }
//   };

//   const changeThemeLayout = () => {
//     setThemeLayout(!themeLayout);
//   };

//   if (themeLayout) {
//     if (process.browser) {
//       document.body.classList.add("dark");
//       config.config.layout_version = "dark";
//     }
//   } else {
//     if (process.browser) {
//       document.body.classList.remove("dark");
//       config.config.layout_version = "light";
//     }
//   }

//   return (
//     <div>
//       {/* theme button */}
//       <div className="sidebar-btn dark-light-btn">
//         <div className="dark-light">
//           <div
//             className="theme-layout-version"
//             onClick={() => changeThemeLayout()}
//           >
//             {themeLayout ? "Light" : "Dark"}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemeSettings;





import React, { useEffect, useState, useContext } from "react";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import config from "./config.json";

const ThemeSettings = () => {
  const context = useContext(SettingContext);
  const [themeLayout, setThemeLayout] = useState(false); // Set to false for light mode

  /*=====================
     Tap on Top
     ==========================*/
  useEffect(() => {
    // Always set to light mode
    if (process.browser) {
      document.body.classList.remove("dark");
      config.config.layout_version = "light";
      document.documentElement.style.setProperty("--theme-default", "light");
    }

    if (config.config.layout_type) {
      const bodyClass = document.body.classList;
      document.body.className = `${bodyClass} light ${config.config.layout_type}`;
    }

    if (localStorage.getItem("color")) {
      document.documentElement.style.setProperty(
        "--theme-default",
        localStorage.getItem("color")
      );
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (process.browser) {
      if (document.documentElement.scrollTop > 600) {
        document.querySelector(".tap-top").style = "display: block";
      } else {
        document.querySelector(".tap-top").style = "display: none";
      }
    }
  };

  return (
    <div>
      {/* Commented out theme toggle button */}
      {/* <div className="sidebar-btn dark-light-btn">
        <div className="dark-light">
          <div
            className="theme-layout-version"
            onClick={() => changeThemeLayout()}
          >
            {themeLayout ? "Light" : "Dark"}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ThemeSettings;