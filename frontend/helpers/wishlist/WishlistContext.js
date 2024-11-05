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

  const fetchWishlist = async (userId) => {
    // console.log("fetchWishlist userId:", userId);
    try {
      const response = await fetch(
        `/api/wishlist/get-user-wishlist?userId=${userId}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      }
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
        // console.log("addToWish data:", data);
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
        setWishlistItems(data.wishlist || []);
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
