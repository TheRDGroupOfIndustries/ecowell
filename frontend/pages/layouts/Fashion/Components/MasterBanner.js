import Link from "next/link";
import { Col, Container, Row } from "reactstrap";
import logo from "../../../../public/assets/images/icon/bigLogo.png";
import ecoSubtitle1 from "../../../../public/assets/images/icon/ecoSubtitle1.png";

const MasterBanner = ({ img, title, desc, link, classes, btn, btnClass }) => {
  console.log("logo: ", logo);
  return (
    <div>
      <div className={`home ${img} ${classes ? classes : "text-center"}`}>
        <Container>
          <Row>
            <Col>
              <div className="slider-contain"
             >
                <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "start",
              }}>
                <img src={logo.src}
                          className=" mb-4"
                          alt=""
                          style={{
                            width: "400px",
                          }}
                        />
                <img src={ecoSubtitle1.src}
                          className=" mb-5"
                          alt=""
                          style={{
                            width: "600px",
                          }}
                        />
                  {/* <h1>{desc}</h1> */} 
                  <Link
                    href={link}
                    className={`btn ${btnClass ? btnClass : "btn-solid"}`}>
                    {/* <a > */}
                    {btn ? btn : "Shop Now"} {/* </a> */}
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MasterBanner;
