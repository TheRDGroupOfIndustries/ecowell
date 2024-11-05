import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";

const CartProvider = (props) => {
  const { data: session } = useSession(); // Use the useSession hook
  const userId = session?.user?._id; // Get userId from session
  // console.log("User  ID from session:", userId); // Log the userId

  const [cartItems, setCartItems] = useState([]);
  // console.log("cartItems:", cartItems);
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState("InStock");

  useEffect(() => {
    if (userId) {
      // Fetch cart items from the database when the component mounts
      const fetchCart = async () => {
        try {
          const response = await fetch(`/api/cart/getCart?userId=${userId}`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache" },
          });
          const data = await response.json();
          if (response.ok) {
            // console.log("data:", data);
            setCartItems(data.items || []);
            setCartTotal(data.totalPrice || 0);
          } // else {
          //   toast.error(data.message || "Failed to fetch cart items.");
          // }
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
        try {
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
        } catch (error) {
          console.error("Error saving cart:", error);
          toast.error("An error occurred while saving the cart.");
        }
      }
    };

    saveCart();
  }, [cartItems, userId]);

  // Add Product To Cart
  const addToCart = async (item, quantity, variant) => {
    // console.log("add to cart", userId, item, quantity, variant);

    const updatedVariant = {
      flavor: variant.flavor,
      image_link: variant.images[0],
      stock: variant.stock,
    };

    const productData = {
      userId,
      productId: item._id,
      variant: updatedVariant,
      quantity,
    };

    // console.log("productData", productData);

    // Call the API to add the product to the cart
    const response = await fetch("/api/cart/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (response.ok) {
      // Update the local state with the new cart items from the API response
      setCartItems(data.cart.items); // Set cart items from the response
      setCartTotal(data.cart.totalPrice); // Update the total price from the response
      toast.success("Product Added Successfully!");
    } else {
      // Handle error response
      toast.error(data.message || "Failed to add product to cart.");
    }
  };

  const removeFromCart = async (item) => {
    try {
      const response = await fetch(`/api/cart/remove-from-cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: item._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.error("Product Removed Successfully !");
        setCartItems(data.cart.items);
        setCartTotal(data.cart.totalPrice);
      } else {
        toast.error(
          data.message ||
            "An error occurred while removing the product from cart."
        );
      }
    } catch (error) {
      toast.error("An error occurred while removing the product from cart.");
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

  const productExistsInCart = (productId) => {
    return cartItems.some((item) => item.productId._id === productId);
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
        productExistsInCart: productExistsInCart,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;
