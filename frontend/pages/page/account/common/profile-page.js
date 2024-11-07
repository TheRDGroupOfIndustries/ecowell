import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container, Row, Form, Input, Label, Col } from "reactstrap";
import { toast } from "react-toastify";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [flatPlot, setFlatPlot] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [regionState, setRegionState] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user?.first_name || "");
      setLastName(user?.last_name || "");
      setPhoneNumber(user?.phone_number || "");
      setEmail(user?.email || "");
      setAddress(user?.address || "");
      setFlatPlot(user?.flat_plot || "");
      setCountry(user?.country || "");
      setRegionState(user?.region_state || "");
      setCity(user?.city || "");
      setZipCode(user?.zip_code || "");
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    const updateUser = {
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      email: email,
      address: address,
      flat_plot: flatPlot,
      country: country,
      region_state: regionState,
      city: city,
      zip_code: zipCode,
    };
    // console.log(updateUser);

    const updateUserDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateUser),
        });
        const data = await response.json();
        // console.log(data);
        if (response.ok) {
          return data.message;
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    toast.promise(updateUserDetails(), {
      pending: "Updating user details...",
      success: {
        render({ data }) {
          return data || "User details updated successfully!";
        },
      },
      error: {
        render({ data }) {
          return data.message || "Failed to update user details.";
        },
      },
    });
  };

  if (!user) return router.push("/page/account/login");

  return (
    <>
      <section className="contact-page register-page">
        <Container>
          <div
            style={{
              width: "100%",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Link
              href={"/page/account/profile/my-orders"}
              style={{
                backgroundColor: "#399B2E",
                color: "white",
                padding: "5px",
              }}
            >
              My Orders
            </Link>
          </div>
          <Row>
            <Col sm="12">
              <h3>PERSONAL DETAIL</h3>
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="first-name">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="first-name"
                      placeholder="Enter Your First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="last-name">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="last-name"
                      placeholder="Enter Your Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="email">
                      Email
                    </Label>
                    <Input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={email ? true : false}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="phone-number">
                      Phone Number
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="phone-number"
                      placeholder="Add your phone number to receive call on delivery"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                        )
                      }
                      disabled={phoneNumber ? true : false}
                    />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="contact-page register-page section-b-space">
        <Container>
          <Row>
            <Col sm="12">
              <h3>SHIPPING ADDRESS</h3>
              <Form className="theme-form">
                <Row>
                  <Col md="6">
                    <Label className="form-label" for="address-two">
                      Address
                      {address ? "" : <span className="text-danger">*</span>}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="address-two"
                      placeholder="Enter Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="home-ploat">
                      Flat / Plot
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="home-ploat"
                      placeholder="Enter Flat/Plot"
                      value={flatPlot}
                      onChange={(e) => setFlatPlot(e.target.value)}
                    />
                  </Col>
                  <Col md="6" className="select_input">
                    <Label className="form-label" for="country">
                      Country
                      {country ? "" : <span className="text-danger">*</span>}
                    </Label>
                    <select
                      className="form-control py-3"
                      size="1"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="U.K">U.K</option>
                      <option value="US">US</option>
                    </select>
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="region-state">
                      Region/State
                      {regionState ? (
                        ""
                      ) : (
                        <span className="text-danger">*</span>
                      )}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="region-state"
                      placeholder="Enter Region/State"
                      value={regionState}
                      onChange={(e) => setRegionState(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="city">
                      City
                      {city ? "" : <span className="text-danger">*</span>}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder="Enter City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Col>
                  <Col md="6">
                    <Label className="form-label" for="zip-code">
                      Zip Code
                      {zipCode ? "" : <span className="text-danger">*</span>}
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="zip-code"
                      placeholder="Enter Zip Code"
                      value={zipCode}
                      onChange={(e) =>
                        setZipCode(
                          e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                        )
                      }
                    />
                  </Col>
                  <div className="col-md-12">
                    <button
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSave}
                      className="btn btn-sm btn-solid"
                    >
                      Save setting
                    </button>
                  </div>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ProfilePage;
