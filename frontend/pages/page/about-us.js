



import React from "react";
import CommonLayout from "../../components/shop/common-layout";
import { Container, Row, Col, Media } from "reactstrap";
import aboutus from "../../public/assets/images/about/about_us.jpg";
import Slider from "react-slick";
import { Slider2, Slider4 } from "../../services/script";
import ServiceLayout from "../../components/common/Service/service1.js";
import baner from '../../public/assets/images/Aboutbanner.jpeg'
const TeamData = [
  {
    img: "/assets/images/team/1.jpg",
    name: "Dr. Emily Chen",
    post: "Founder & Chief Nutritionist",
  },
  {
    img: "/assets/images/team/2.jpg",
    name: "Michael Rodriguez",
    post: "Head of Research & Development",
  },
  {
    img: "/assets/images/team/3.jpg",
    name: "Sarah Thompson",
    post: "Wellness Strategy Director",
  },
  {
    img: "/assets/images/team/4.jpg",
    name: "David Kim",
    post: "Quality Assurance Lead",
  },
  {
    img: "/assets/images/team/1.jpg",
    name: "Lisa Patel",
    post: "Nutrition Science Specialist",
  },
];

const Team = ({ img, name, post }) => {
  return (
    <div>
      <div>
        <Media src={img} className="img-fluid blur-up lazyload bg-img" alt="" />
      </div>
      <h4>{name}</h4>
      <h6>{post}</h6>
    </div>
  );
};

const TeamDetailData = [
  {
    img: "/assets/images/avtar.jpg",
    name: "Dr. Emily Chen",
    post: "Founder",
    about: "With over 15 years of experience in nutrition and holistic wellness, I founded EcoWell to provide scientifically-backed, natural supplements that support optimal health and well-being.",
  },
  {
    img: "/assets/images/2.jpg",
    name: "Michael Rodriguez",
    post: "Research Director",
    about: "Our rigorous research process ensures that every EcoWell supplement is developed using the highest quality, sustainably sourced ingredients and cutting-edge nutritional science.",
  },
  {
    img: "/assets/images/avtar.jpg",
    name: "Sarah Thompson",
    post: "Wellness Expert",
    about: "We believe in a holistic approach to health, combining superior nutritional supplements with education and lifestyle guidance to help our customers achieve their wellness goals.",
  },
  {
    img: "/assets/images/avtar.jpg",
    name: "David Kim",
    post: "Quality Assurance",
    about: "Our commitment to quality means every supplement undergoes extensive testing to ensure purity, potency, and safety for our customers.",
  },
  {
    img: "/assets/images/avtar.jpg",
    name: "Lisa Patel",
    post: "Nutrition Scientist",
    about: "By staying at the forefront of nutritional research, we continuously innovate to create supplements that address modern health challenges.",
  },
  {
    img: "/assets/images/avtar.jpg",
    name: "Mark Johnson",
    post: "Sustainability Lead",
    about: "Our eco-friendly practices ensure that our supplements not only support human health but also contribute to the health of our planet.",
  },
];

const TeamDetail = ({ img, name, post, about }) => {
  return (
    <div>
      <div className="media">
        <div className="text-center">
          <Media src={img} alt="#" />
          <h5>{name}</h5>
          <h6>{post}</h6>
        </div>
        <div className="media-body">
          <p>{about}</p>
        </div>
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <>
      <CommonLayout parent="home" title="About-us">
        <section className="about-page section-b-space">
          <Container>
            <Row>
              <Col lg="12">
                <div className="banner-section">
                  <Media src={baner.src} className="img-fluid blur-up lazyload" alt="" />
                </div>
              </Col>
              <Col sm="12">
                <h4>Empowering Wellness Through Natural, Science-Driven Nutrition</h4>
                <p>At EcoWell, we are dedicated to transforming health through innovative, sustainable nutritional supplements.</p>
                <p>
                  Our mission goes beyond simply creating supplements. We are committed to providing holistic wellness solutions that address the complex nutritional needs of modern life. By combining
                  cutting-edge nutritional science with sustainable, natural ingredients, we create supplements that support your body's optimal functioning.

                  We understand that true wellness is a journey, not a destination. That's why our approach is comprehensive – focusing not just on individual supplements, but on supporting
                  your overall health, energy, and vitality. Each product is carefully formulated to meet the highest standards of quality, efficacy, and environmental responsibility.
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="testimonial small-section">
          <Container>
            <Row>
              <Col sm="12">
                <Slider {...Slider2} className="slide-2 testimonial-slider no-arrow">
                  {TeamDetailData.map((data, i) => {
                    return <TeamDetail key={i} img={data.img} name={data.name} post={data.post} about={data.about} />;
                  })}
                </Slider>
              </Col>
            </Row>
          </Container>
        </section>

        <section id="team" className="team section-b-space ratio_asos">
          <Container>
            <Row>
              <Col sm="12">
                <h2>Our Team</h2>
                <Slider className="team-4" {...Slider4}>
                  {TeamData.map((data, i) => {
                    return <Team key={i} img={data.img} name={data.name} post={data.post} />;
                  })}
                </Slider>
              </Col>
            </Row>
          </Container>
        </section>

        <div className="section-b-space">
          <ServiceLayout sectionClass={"service border-section small-section"} />
        </div>
      </CommonLayout>
    </>
  );
};

export default AboutUs;