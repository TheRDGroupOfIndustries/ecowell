// import React, { useState, useEffect } from "react";
// import Context from "./index";
// import { toast } from "react-toastify";

// const getLocalCartItems = () => {
//   try {
//     const list = localStorage.getItem("cartList");
//     if (list === null) {
//       return [];
//     } else {
//       return JSON.parse(list);
//     }
//   } catch (err) {
//     return [];
//   }
// };

// const CartProvider = (props) => {
//   const [cartItems, setCartItems] = useState(getLocalCartItems());
//   const [cartTotal, setCartTotal] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [stock, setStock] = useState("InStock");

//   useEffect(() => {
//     const Total = cartItems.reduce((a, b) => a + b.total, 0);
//     setCartTotal(Total);

//     localStorage.setItem("cartList", JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Add Product To Cart
//   const addToCart = (item, quantity) => {
//     toast.success("Product Added Successfully !");
//     const index = cartItems.findIndex((itm) => itm.id === item.id);

//     if (index !== -1) {
//       cartItems[index] = {
//         ...item,
//         qty: quantity,
//         total: (item.price - (item.price * item.discount) / 100) * quantity,
//       };
//       setCartItems([...cartItems]);
//     } else {
//       const product = {
//         ...item,
//         qty: quantity,
//         total: item.price - (item.price * item.discount) / 100,
//       };
//       setCartItems([...cartItems, product]);
//     }
//   };

//   const removeFromCart = (item) => {
//     toast.error("Product Removed Successfully !");
//     setCartItems(cartItems.filter((e) => e.id !== item.id));
//   };

//   const minusQty = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//       setStock("InStock");
//     }
//   };

//   const plusQty = (item) => {
//     if (item.stock >= quantity) {
//       setQuantity(quantity + 1);
//     } else {
//       setStock("Out of Stock !");
//     }
//   };

//   // Update Product Quantity
//   const updateQty = (item, quantity) => {
//     if (quantity >= 1) {
//       const index = cartItems.findIndex((itm) => itm.id === item.id);
//       if (index !== -1) {
//         cartItems[index] = {
//           ...item,
//           qty: quantity,
//           total: item.price * quantity,
//         };
//         setCartItems([...cartItems]);
//         toast.info("Product Quantity Updated !");
//       } else {
//         const product = {
//           ...item,
//           qty: quantity,
//           total: (item.price - (item.price * item.discount) / 100) * quantity,
//         };
//         setCartItems([...cartItems, product]);
//         toast.success("Product Added Updated !");
//       }
//     } else {
//       toast.error("Enter Valid Quantity !");
//     }
//   };

//   return (
//     <Context.Provider
//       value={{
//         ...props,
//         state: cartItems,
//         cartTotal,
//         setQuantity,
//         quantity,
//         stock,
//         addToCart: addToCart,
//         removeFromCart: removeFromCart,
//         plusQty: plusQty,
//         minusQty: minusQty,
//         updateQty: updateQty,
//       }}
//     >
//       {props.children}
//     </Context.Provider>
//   );
// };

// export default CartProvider;










import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";


const CartProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");
  const { data: session } = useSession();


  // Fetch cart items from the database when the component mounts
  useEffect(() => {
   
    const fetchCartItems = async (userId) => {
      try {
        const response = await fetch(`/api/cart/get-user-cart?userId=${userId}`);
        if (response.ok) {
          const items = await response.json();
          setCartItems(items);
          calculateCartTotal(items);
        } else {
          toast.error("Failed to fetch cart items.");
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    if (session) {
      fetchCartItems(session.user._id);
    }

  }, [session]);

  const calculateCartTotal = (items) => {
    const total = items.reduce((a, b) => a + b.total, 0);
    setCartTotal(total);
  };

  // Add Product To Cart
  const addToCart = async (item, quantity) => {
    try {
      const response = await fetch("/api/cart/add-to-user-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId:session.user._id,
          item: {
            ...item,
            qty: quantity,
            total: (item.price - (item.price * item.discount) / 100) * quantity,
          },
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculateCartTotal(updatedCart.items);
        toast.success("Product Added Successfully!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // Remove Product From Cart
  const removeFromCart = async (item) => {
    try {
      const response = await fetch(`/api/cart?userId=${session.user._id}&itemId=${item.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculateCartTotal(updatedCart.items);
        toast.error("Product Removed Successfully!");
      } else {
        toast.error("Failed to remove product from cart.");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  // Update Product Quantity
  const updateQty = async (item, newQuantity) => {
    if (newQuantity < 1) {
      return toast.error("Enter a valid quantity!");
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user._id,
          itemId: item.id,
          newQuantity,
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
        calculateCartTotal(updatedCart.items);
        toast.info("Product Quantity Updated!");
      } else {
        toast.error("Failed to update product quantity.");
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };

  const minusQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStock("InStock");
    }
  };

  const plusQty = (item) => {
    if (item.stock >= quantity) {
      setQuantity(quantity + 1);
    } else {
      setStock("Out of Stock!");
    }
  };

  return (
    <Context.Provider
      value={{
        ...props,
        state: cartItems,
        cartTotal,
        setQuantity,
        quantity,
        stock,
        addToCart,
        removeFromCart,
        plusQty,
        minusQty,
        updateQty,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;













// import React, { useState, useEffect, useCallback } from "react";
// import Context from "./index";
// import { toast } from "react-toastify";
// import { useSession } from "next-auth/react";

// const CartProvider = (props) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartTotal, setCartTotal] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [stock, setStock] = useState("InStock");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitialLoading, setIsInitialLoading] = useState(true);

//   const { data: session, status } = useSession();

//   // Calculate Cart Total
//   const calculateCartTotal = useCallback((items) => {
//     const total = items.reduce((acc, item) => acc + item.total, 0);
//     setCartTotal(total);
//   }, []);

//   // Fetch Cart Items from API on Mount
//   useEffect(() => {
//     let mounted = true;

//     const fetchCartItems = async () => {
//       if (!session?.user?._id) return;

//       try {
//         const response = await fetch("/api/cart/getAllCartItems", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ userId: session.user._id }),
//         });

//         if (!response.ok) throw new Error("Failed to fetch cart items");

//         const data = await response.json();
//         if (mounted) {
//           setCartItems(data.items);
//           calculateCartTotal(data.items);
//         }
//       } catch (error) {
//         console.error("Failed to fetch cart items:", error);
//         toast.error("Failed to load cart items");
//       } finally {
//         if (mounted) {
//           setIsInitialLoading(false);
//         }
//       }
//     };

//     fetchCartItems();

//     return () => {
//       mounted = false;
//     };
//   }, [session, calculateCartTotal]);

//   // Add Product To Cart
//   const addToCart = async (item, quantity) => {
//     if (!session?.user?._id) {
//       toast.error("Please log in to add items to cart");
//       return;
//     }

//     // Validate stock before optimistic update
//     if (item.stock < quantity) {
//       toast.error("Not enough stock available");
//       return;
//     }

//     setIsLoading(true);

//     // Optimistic update
//     const newItem = {
//       id: Date.now().toString(), // temporary ID
//       product: item,
//       quantity,
//       price: item.sale ? item.price * (1 - item.discount / 100) : item.price,
//       total: (item.sale ? item.price * (1 - item.discount / 100) : item.price) * quantity,
//       stock: item.stock
//     };

//     // Check if item already exists
//     const existingItem = cartItems.find(cartItem =>
//       cartItem.product._id === item._id
//     );

//     let updatedItems;
//     if (existingItem) {
//       updatedItems = cartItems.map(cartItem =>
//         cartItem.product._id === item._id
//           ? { ...cartItem, quantity: cartItem.quantity + quantity, total: cartItem.price * (cartItem.quantity + quantity) }
//           : cartItem
//       );
//     } else {
//       updatedItems = [...cartItems, newItem];
//     }

//     setCartItems(updatedItems);
//     calculateCartTotal(updatedItems);

//     try {
//       const response = await fetch("/api/cart/addToUserCart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session.user._id,
//           item,
//           quantity
//         }),
//       });

//       if (!response.ok) {
//         // Revert optimistic update on error
//         setCartItems(cartItems);
//         calculateCartTotal(cartItems);
//         throw new Error("Failed to add product to cart");
//       }

//       const data = await response.json();
//       setCartItems(data.items);
//       calculateCartTotal(data.items);
//       toast.success("Product Added Successfully!");
//     } catch (error) {
//       console.log("Failed to add product to cart:", error);
//       toast.error("Failed to add product");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Remove Product From Cart
//   const removeFromCart = async (item) => {
//     if (!session?.user?._id) {
//       toast.error("Please log in to remove items from cart");
//       return;
//     }

//     setIsLoading(true);

//     // Optimistic update
//     const updatedItems = cartItems.filter(cartItem => cartItem.id !== item.id);
//     setCartItems(updatedItems);
//     calculateCartTotal(updatedItems);

//     try {
//       const response = await fetch("/api/cart/removeFromUserCart", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session.user._id,
//           id: item.id
//         }),
//       });

//       if (!response.ok) {
//         // Revert optimistic update on error
//         setCartItems(cartItems);
//         calculateCartTotal(cartItems);
//         throw new Error("Failed to remove product from cart");
//       }

//       const data = await response.json();
//       setCartItems(data.items);
//       calculateCartTotal(data.items);
//       toast.success("Product Removed Successfully!");
//     } catch (error) {
//       console.error("Failed to remove product from cart:", error);
//       toast.error("Failed to remove product");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update Product Quantity in Cart
//   const updateQty = async (item, newQuantity) => {
//     if (!session?.user?._id) {
//       toast.error("Please log in to update cart");
//       return;
//     }

//     if (newQuantity < 1) {
//       toast.error("Enter Valid Quantity!");
//       return;
//     }

//     if (item.product.stock < newQuantity) {
//       toast.error("Not enough stock available");
//       return;
//     }

//     setIsLoading(true);

//     // Optimistic update
//     const updatedItems = cartItems.map(cartItem =>
//       cartItem.id === item.id
//         ? { ...cartItem, quantity: newQuantity, total: cartItem.price * newQuantity }
//         : cartItem
//     );
//     setCartItems(updatedItems);
//     calculateCartTotal(updatedItems);

//     try {
//       const response = await fetch("/api/cart/updateCartItemQuantity", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session.user._id,
//           itemId: item.id,
//           quantity: newQuantity
//         }),
//       });

//       if (!response.ok) {
//         // Revert optimistic update on error
//         setCartItems(cartItems);
//         calculateCartTotal(cartItems);
//         throw new Error("Failed to update quantity");
//       }

//       const data = await response.json();
//       setCartItems(data.items);
//       calculateCartTotal(data.items);
//       toast.success("Quantity Updated Successfully!");
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//       toast.error("Failed to update quantity");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Local quantity adjustments
//   const minusQty = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//       setStock("InStock");
//     }
//   };

//   const plusQty = (item) => {
//     if (item.stock > quantity) {
//       setQuantity(prev => prev + 1);
//     } else {
//       setStock("Out of Stock!");
//       toast.warning("Maximum available stock reached");
//     }
//   };

//   // Clear cart
//   const clearCart = useCallback(async () => {
//     if (!session?.user?._id) return;

//     setCartItems([]);
//     setCartTotal(0);
//     // You might want to add an API endpoint to clear the cart in the database as well
//   }, [session]);

//   return (
//     <Context.Provider
//       value={{
//         ...props,
//         state: cartItems,
//         cartTotal,
//         setQuantity,
//         quantity,
//         stock,
//         isLoading,
//         isInitialLoading,
//         addToCart,
//         removeFromCart,
//         plusQty,
//         minusQty,
//         updateQty,
//         clearCart,
//       }}
//     >
//       {props.children}
//     </Context.Provider>
//   );
// };

// export default CartProvider;