import React, { useState, useContext, useEffect } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { toast } from "react-toastify";

const Category = () => {
  const context = useContext(FilterContext);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const setSelectedCategory = context.setSelectedCategory;

  // const updateCategory = (category) => {
  //   console.log("Category selected:", category);
  //   setSelectedCategory(category);
  // };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/all-categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Only title, image_link, and slug to show
        let categoriesToShow = data.map((category) => {
          return { title: category.title, slug: category.slug, image_link: category.image_link };
        });
        setCategories(categoriesToShow);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="collection-collapse-block open">
        <h3 className="collapse-block-title" onClick={toggleCategory}>
          Category
        </h3>
        <Collapse isOpen={isCategoryOpen}>
          <div className="collection-collapse-block-content">
            <div className="collection-brand-filter">
              <ul className="category-list">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a href={null} onClick={() => context.handleCategory(category.slug)}>
                      {category.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Category;