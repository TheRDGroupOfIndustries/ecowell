import React, {createContext , useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const Context = createContext({
  wishlistItems: Function,
  addToWish: Function,
  removeFromWish: Function
}
);

const getLocalWishlistItems = () => {
  try {
    const list = localStorage.getItem('wishlist');
      if (list === null) {
        return [];
      }else{
        return JSON.parse(list)
      }
  } catch (err) {
    return [];
  }
};

export const Provider = (props) => {

    const [wishlistItems, setWishlistItems] = useState(getLocalWishlistItems())

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    }, [wishlistItems])


    // Add Product To Wishlist
    const addToWish = (item) => {
        const index = wishlistItems.findIndex(wish => wish.id === item.id)
        if (index === -1) {
            toast.success("Product Added Successfully !");
            setWishlistItems([...wishlistItems, item])
        }else{
          toast.error("This Product Already Added !");
        }
    }

    // Remove Product From Wishlist
    const removeFromWish = (item) => {
      setWishlistItems(wishlistItems.filter((e)=>(e.id !== item.id)))
      toast.error("Product Removed Successfully !");
    }

    // const {value} = props

    return (
        <Context.Provider value={{
            wishlistItems:wishlistItems,
            addToWish:addToWish,
            removeFromWish:removeFromWish
          }}>
          {props.children}
        </Context.Provider>
      );
}

export {
  Context as WishlistContext,
  Provider as WishlistContextProvider,
} from "./WishlistContext";







// import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import { useSession } from "next-auth/react";

// export const WishlistContext = createContext({
//   wishlistItems: [],
//   addToWish: () => { },
//   removeFromWish: () => { },
// });

// export const WishlistContextProvider = (props) => {
//   const [wishlistItems, setWishlistItems] = useState([]);

//   const { data: session, status } = useSession();
//   console.log("wishlist", session?.user._id);

//   useEffect(() => {
//     if (session) {
//       fetchWishlist(session.user._id);
//     }
//   }, [session]);

//   const fetchWishlist = async (userId) => {
//     try {
//       const response = await fetch(`/api/wishlist/getWishlist?userId=${userId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setWishlistItems(data.products);
//       } else {
//         console.error('Error fetching wishlist:', response.status);
//         toast.error('Failed to fetch wishlist');
//       }
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//       toast.error('Failed to fetch wishlist');
//     }
//   };

//   const addToWish = async (product) => {
//     try {
//       const response = await fetch('/api/wishlist/addToWishlist', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId: session.user._id, productId: product.id }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setWishlistItems(data.wishlist.products);
//         toast.success('Product added to wishlist');
//       } else {
//         console.error('Error adding product to wishlist:', response.status);
//         toast.error('Failed to add product to wishlist');
//       }
//     } catch (error) {
//       console.error('Error adding product to wishlist:', error);
//       toast.error('Failed to add product to wishlist');
//     }
//   };

//   const removeFromWish = async (product) => {
//     try {
//       const response = await fetch('/api/wishlist/removeFromWishlist', {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId: session.user._id, productId: product.id }),
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setWishlistItems(data.wishlist.products);
//         toast.error('Product removed from wishlist');
//       } else {
//         console.error('Error removing product from wishlist:', response.status);
//         toast.error('Failed to remove product from wishlist');
//       }
//     } catch (error) {
//       console.error('Error removing product from wishlist:', error);
//       toast.error('Failed to remove product from wishlist');
//     }
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         wishlistItems,
//         addToWish,
//         removeFromWish,
//       }}
//     >
//       {props.children}
//     </WishlistContext.Provider>
//   );
// };