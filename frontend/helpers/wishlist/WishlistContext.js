// import React, {createContext , useState, useEffect } from 'react';
// import { toast } from 'react-toastify';

// export const Context = createContext({
//   wishlistItems: Function,
//   addToWish: Function,
//   removeFromWish: Function
// }
// );

// const getLocalWishlistItems = () => {
//   try {
//     const list = localStorage.getItem('wishlist');
//       if (list === null) {
//         return [];
//       }else{
//         return JSON.parse(list)
//       }
//   } catch (err) {
//     return [];
//   }
// };

// export const Provider = (props) => {

//     const [wishlistItems, setWishlistItems] = useState(getLocalWishlistItems())

//     useEffect(() => {
//         localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
//     }, [wishlistItems])

//     // Add Product To Wishlist
//     const addToWish = (item) => {
//         const index = wishlistItems.findIndex(wish => wish.id === item.id)
//         if (index === -1) {
//             toast.success("Product Added Successfully !");
//             setWishlistItems([...wishlistItems, item])
//         }else{
//           toast.error("This Product Already Added !");
//         }
//     }

//     // Remove Product From Wishlist
//     const removeFromWish = (item) => {
//       setWishlistItems(wishlistItems.filter((e)=>(e.id !== item.id)))
//       toast.error("Product Removed Successfully !");
//     }

//     // const {value} = props

//     return (
//         <Context.Provider value={{
//             wishlistItems:wishlistItems,
//             addToWish:addToWish,
//             removeFromWish:removeFromWish
//           }}>
//           {props.children}
//         </Context.Provider>
//       );
// }

// export {
//   Context as WishlistContext,
//   Provider as WishlistContextProvider,
// } from "./WishlistContext";

"use client";

import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export const WishlistContext = createContext({
  wishlistItems: [],
  addToWish: () => {},
  removeFromWish: () => {},
});

export const WishlistContextProvider = (props) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const { data: session } = useSession();
  const userId = session && session?.user?._id;
  console.log("session:", session);

  const fetchWishlist = async (userId) => {
    try {
      const response = await fetch(
        `/api/wishlist/get-user-wishlist?userId=${userId}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      } // else {
      //   console.error("Error fetching wishlist:", response.status);
      //   toast.error("Failed to fetch wishlist");
      // }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      // toast.error("Failed to fetch wishlist");
    }
  };

  useEffect(() => {
    if (session && userId) {
      fetchWishlist(userId);
    }
  }, [session, userId]);

  const addToWish = async (product) => {
    console.log("addToWish product:", product);

    try {
      const response = await fetch("/api/wishlist/add-to-user-wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("addToWish data:", data);
        setWishlistItems(data.wishlist);
        toast.success("Product added to wishlist");
      } else toast.error(data.message);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      toast.error("Failed to add product to wishlist");
    }
  };

  const removeFromWish = async (product) => {
    try {
      const response = await fetch("/api/wishlist/remove-from-user-wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.wishlist.products);
        toast.error("Product removed from wishlist!");
      } else {
        console.error("Error removing product from wishlist:", response.status);
        toast.error("Failed to remove product from wishlist");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Failed to remove product from wishlist");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWish,
        removeFromWish,
      }}
    >
      {props.children}
    </WishlistContext.Provider>
  );
};
