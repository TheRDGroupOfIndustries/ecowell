import React from "react";
import Slider from "react-slick";
import MasterBanner from "../../Fashion/Components/MasterBanner";
import ecoSubtitle1 from "../../../../public/assets/images/icon/ecoSubtitle1.png";
import ecoSubtitle2 from "../../../../public/assets/images/icon/ecoSubtitle2.png";

const Data = [
  {
    img: "home1",
    title: "welcome to fashion",
    desc: "men fashion",
    link: "#",
    ecoSubtitle: ecoSubtitle1,
  },
  {
    img: "home2",
    title: "welcome to fashion",
    desc: "Top collection",
    link: "#",
    ecoSubtitle: ecoSubtitle2,
  },
];

const HomeSlider = () => {
  console.log("ecoSubtitle1: ", ecoSubtitle1);
  return (
    <section className="p-0">
      <Slider className="slide-1 home-slider">
        {Data.map((data, i) => {
          return (
            <MasterBanner
              key={i}
              img={data.img}
              link={data.link}
              title={data.title}
              ecoSubtitle={ data.ecoSubtitle  }
              desc={data.desc}
            />
          );
        })}
      </Slider>
    </section>
  );
};

export default HomeSlider;
