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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/all-categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
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
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // prevent default link behavior
                        context.handleCategory(category.slug);
                      }}
                      style={{
                        color: context.selectedCategory === category.slug ? '#4CAF50' : 'inherit'
                      }}
                    >
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
