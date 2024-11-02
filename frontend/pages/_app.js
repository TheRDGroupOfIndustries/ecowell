import { getServerSession } from "next-auth"; // Import getServerSession
import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { useApollo } from "../helpers/apollo";
import { WishlistContextProvider } from "../helpers/wishlist/WishlistContext";
import { CompareContextProvider } from "../helpers/Compare/CompareContext";
import { CurrencyContextProvider } from "../helpers/Currency/CurrencyContext";
// import MessengerCustomerChat from "react-messenger-customer-chat";
import TapTop from "../components/common/widgets/Tap-Top";
import ThemeSettings from "../components/customizer/theme-settings";
import CartContextProvider from "../helpers/cart/CartContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import SettingProvider from "../helpers/theme-setting/SettingProvider";
import "../public/assets/scss/app.scss";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res);
  // console.log("session: ", session);
  return {
    props: {
      session,
    },
  };
}

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState();
  const apolloClient = useApollo(pageProps);

  useEffect(() => {
    const path = window.location.pathname.split("/");
    const url = path[path.length - 1];
    document.body.classList.add("dark");

    let timer = setTimeout(function () {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <ApolloProvider client={apolloClient}>
          {isLoading ? (
            <div className="loader-wrapper">
              {url === "Christmas" ? (
                <div id="preloader"></div>
              ) : (
                <div className="loader"></div>
              )}
            </div>
          ) : (
            <>
              <Helmet>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                {/* <Head><link rel="icon" type="image/x-icon" href={favicon} /></Head> */}
                <title>EcoWel - Get yourself some protiens</title>
              </Helmet>
              <div>
                <SettingProvider>
                  <CompareContextProvider>
                    <CurrencyContextProvider>
                      <CartContextProvider>
                        <WishlistContextProvider>
                          <FilterProvider>
                            <Component {...pageProps} />
                          </FilterProvider>
                        </WishlistContextProvider>
                      </CartContextProvider>
                    </CurrencyContextProvider>
                    <ThemeSettings />
                  </CompareContextProvider>
                </SettingProvider>
                <ToastContainer />
                <TapTop />
              </div>
            </>
          )}
        </ApolloProvider>
      </SessionProvider>
    </>
  );
}
