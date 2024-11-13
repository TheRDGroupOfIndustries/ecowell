import React, { useEffect, useState } from "react";
import FilterContext from "./FilterContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const FilterProvider = (props) => {
  const router = useRouter();
  const brand = router.query.brand;
  const flavor = router.query.flavor;
  const size = router.query.size;
  const category = router.query.category;
  const min = router.query.min;
  const max = router.query.max;
  let sizeParam = size ? size.split(",") : null;
  let param = brand ? brand.split(",") : [];
  let flavorParam = flavor ? flavor.split(",") : [];
  const [selectedCategory, setSelectedCategory] = useState(
    category ? category : ""
  );
  const [selectedBrands, setSelectedBrands] = useState(param ? param : []);
  const [selectedFlavors, setSelectedFlavors] = useState(flavorParam ? flavorParam : []);
  const [selectedSize, setSelectedSize] = useState(sizeParam ? sizeParam : []);
  const [selectedPrice, setSelectedPrice] = useState({
    min: min ? min : 0,
    max: max ? max : 500,
  });
  const [isChecked, setIsChecked] = useState(true);
  const [filterChecked, setFilterChecked] = useState([{}]);

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [data, setData] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flavors, setFlavors] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProduct(true);
        const response = await fetch("/api/products/getAllProducts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const dataTemp = await response.json();
        console.log("Fetched Products:", dataTemp);
        let dataTemp1 = [...dataTemp];
        setAllProducts(dataTemp1);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedBrands([]);
    setSelectedFlavors([]);
  }, [selectedCategory]);

  useEffect(() => {

    filterProducts();
  }, [selectedCategory, allProducts, selectedBrands, selectedFlavors]);

  useEffect(() => {
    extractUniqueBrandsAndFlavors();
  }, [categoryData]);

  const extractUniqueBrandsAndFlavors = () => {
    const uniqueBrands = [...new Set(data.map(product => product.brand.toLowerCase()))];
    const uniqueFlavors = [...new Set(data.flatMap(product => product.variants.map(variant => variant.flavor.toLowerCase())))];
    setBrands(uniqueBrands);
    setFlavors(uniqueFlavors);
  };

  const filterProducts = () => {

    let filteredProductsData = allProducts;

    if (selectedCategory) {
      filteredProductsData = filteredProductsData.filter(product => product.category.slug === selectedCategory);
      setCategoryData(filteredProductsData);
    }else {
      setCategoryData(filteredProductsData);
    }

    if (selectedBrands.length > 0) {
      filteredProductsData = filteredProductsData.filter(product => selectedBrands.includes(product.brand.toLowerCase()));
    }

    if (selectedFlavors.length > 0) {
      filteredProductsData = filteredProductsData.filter(product =>
        product.variants.some(variant => selectedFlavors.includes(variant.flavor.toLowerCase()))
      );
    }

    setData(filteredProductsData);
    setVisibleProducts(filteredProductsData.slice(0, limit));
  };

  const handlePagination = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newLimit = visibleProducts.length + 10;
      setVisibleProducts(data.slice(0, newLimit));
      setIsLoading(false);
    }, 1000);
  };

  const handleBrands = (brand, checked) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((e) => e !== brand));
    }
    filterProducts();
  };

    const handleFlavors = (flavor, checked) => {
    if (checked) {
      setSelectedFlavors([...selectedFlavors, flavor]);
    } else {
      setSelectedFlavors(selectedFlavors.filter((e) => e !== flavor));
    }
    filterProducts();
  };

  const handleSizes = (size, checked) => {
    var index = selectedSize.indexOf(size);
    if (index > -1) {
      setIsChecked(!isChecked);
      setFilterChecked([{ size, checked }]);
      setSelectedSize(selectedSize.filter((e) => e !== size));
    } else {
      setIsChecked(!isChecked);
      setFilterChecked([{ size, checked }]);
      setSelectedSize([...selectedSize, size]);
    }
  };

  const handleCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <FilterContext.Provider
      value={{
        ...props,
        state: selectedCategory,
        selectedCategory,
        setSelectedFlavors,
        setSelectedCategory,
        setSelectedBrands,
        selectedBrands,
        selectedFlavors,
        selectedPrice,
        isChecked,
        filterChecked,
        selectedSize,
        setSelectedSize,
        setSelectedPrice,
        handleCategory: handleCategory,
        handleBrands: handleBrands,
        handleFlavors: handleFlavors,
        handleSizes: handleSizes,
        handlePagination: handlePagination,
        loadingProduct, setLoadingProduct,
        data, setData,
        visibleProducts, setVisibleProducts, setLimit, limit, isLoading, setIsLoading,
        brands, flavors
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;