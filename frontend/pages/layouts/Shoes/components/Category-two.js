import React, { Fragment, useContext, useEffect, useState } from "react";
import { Container, Media, Row } from "reactstrap";
import Slider from "react-slick";
import { toast } from "react-toastify";
import FilterContext from "../../../../helpers/filter/FilterContext";
import Link from "next/link";

const MasterCategory = ({ img, title, link, slug }) => {
  const filterContext = useContext(FilterContext);
  return (
    <div
      className="border-padding"
      onClick={() => {
        console.log("Selected Category:", slug);
        filterContext.setSelectedCategory(slug);
      }}
    >
      <Link href={link}>
        {/* <a onClick={(e) => e.preventDefault()}> */}
          <div className="category-banner">
            <div>
              <Media
                src={img}
                className="img-fluid blur-up lazyload bg-img"
                alt=""
              />
            </div>
            <div className="category-box cursor-pointer">
              <h2>{title}</h2>
            </div>
          </div>
        {/* </a> */}
      </Link>
    </div>
  );
};

const CategoryTwo = () => {
  const [categories, setCategories] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories/all-categories");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Only title, image_link, and slug to show
        let categoriesToShow = data.map((category) => {
          return {
            title: category.title,
            slug: category.slug,
            image_link: category.image_link,
          };
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
    <Fragment>
      <section className="p-0 ratio2_1">
        <div className={"title1"}>
          <h2 className="text-center title-inner1">Browse Categories</h2>
          <div className="line">
            <span></span>
          </div>
        </div>
        <Container
          fluid={true}
          style={{
            width: "95%",
          }}
        >
          <Row className="category-border">
            <Slider {...settings} arrows>
              {categories.map((data, i) => {
                return (
                  <MasterCategory
                    key={i}
                    img={data.image_link}
                    title={data.title}
                    slug={data.slug}
                    link={"/shop/left_sidebar"}
                  />
                );
              })}
            </Slider>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default CategoryTwo;