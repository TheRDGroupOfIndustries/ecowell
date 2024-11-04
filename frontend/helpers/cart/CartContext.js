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
import { useSession } from "next-auth/react"; // Import useSession

const CartProvider = (props) => {
  const { data: session } = useSession(); // Use the useSession hook
  const userId = session?.user?.authUser?._id; // Get userId from session
  console.log("User  ID from session:", userId); // Log the userId

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");

  useEffect(() => {
    if (userId) {
      // Fetch cart items from the database when the component mounts
      const fetchCart = async () => {
        try {
          const response = await fetch(`/api/cart/getCart?userId=${userId}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache', // Prevent caching
            },
          });
          const data = await response.json();
          if (response.ok) {
            setCartItems(data.items || []);
            setCartTotal(data.totalPrice || 0);
          } else {
            toast.error(data.message || "Failed to fetch cart items.");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
          toast.error("An error occurred while fetching the cart.");
        }
      };

      fetchCart();
    }
  }, [userId]); // Only run when userId changes

  useEffect(() => {
    const Total = cartItems.reduce((a, b) => a + b.total, 0);
    setCartTotal(Total);

    // Save cart items to the database when they change
    const saveCart = async () => {
      if (userId) {
        await fetch(`/api/cart/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            items: cartItems,
            totalPrice: Total,
          }),
        });
      }
    };

    saveCart();
  }, [cartItems, userId]);

  // Add Product To Cart
  const addToCart = async (item, quantity) => {
    toast.success("Product Added Successfully!");

    // Prepare the product data
    const productData = {
        userId, // Get userId from session
        productId: item._id, // Assuming item has an _id field
        quantity,
        variant: item.variant || null, // Include variant if applicable
    };

    // Call the API to add the product to the cart
    const response = await fetch('/api/cart/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (response.ok) {
        // Update the local state with the new cart items from the API response
        setCartItems(data.cart.items); // Set cart items from the response
        setCartTotal(data.cart.totalPrice); // Update the total price from the response
    } else {
        // Handle error response
        toast.error(data.message || "Failed to add product to cart.");
    }
};

  const removeFromCart = async (item) => {
    toast.error("Product Removed Successfully !");
    setCartItems(cartItems.filter((e) => e.id !== item.id));
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
      setStock("Out of Stock !");
    }
  };

  // Update Product Quantity
  const updateQty = async (item, quantity) => {
    if (quantity >= 1) {
      const index = cartItems.findIndex((itm) => itm.id === item.id);
      if (index !== -1) {
        cartItems[index] = {
          ...item,
          qty: quantity,
          total: item.price * quantity,
        };
        setCartItems([...cartItems]);
        toast.info("Product Quantity Updated !");
      } else {
        const product = {
          ...item,
          qty: quantity,
          total: (item.price - (item.price * item.discount) / 100) * quantity,
        };
        setCartItems([...cartItems, product]);
        toast.success("Product Added Updated !");
      }
    } else {
      toast.error("Enter Valid Quantity !");
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
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        plusQty: plusQty,
        minusQty: minusQty,
        updateQty: updateQty,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;