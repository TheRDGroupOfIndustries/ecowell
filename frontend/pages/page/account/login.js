import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { toast } from "react-toastify";

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailOrPhone = (e) => {
    let inputValue = e.target.value;
    setEmailOrPhone(inputValue);
    setEmail("");

    if (emailPattern.test(inputValue)) {
      setIsEmail(true);
      setEmail(inputValue);
      toast.success("Valid email");
      setDisableBtn(false);
    } else {
      setIsEmail(false);
      if (/^\d+$/.test(inputValue) && inputValue.length <= 10) {
        inputValue = inputValue.replace(/[^\d]/g, "").slice(0, 10);
        setEmailOrPhone(inputValue);
        setDisableBtn(false);
      } else {
        // toast.error("Invalid input");
        setDisableBtn(true);
      }
    }
  };

  // const handleEmail = (e) => {
  //   const inputValue = e.target.value;
  //   setEmail(inputValue);

  //   if (inputValue.trim() === "") {
  //     setDisableBtn(true);
  //   } else {
  //     if (!emailPattern.test(inputValue)) {
  //       toast.error("Invalid email");
  //       setDisableBtn(true);
  //     } else {
  //       toast.success("Valid email");
  //       setDisableBtn(false);
  //     }
  //   }
  // };

  const handlePassword = (e) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
    const validations = [
      { condition: inputValue.trim() === "", message: "Password is required." },
      {
        condition: !/(?=.*[a-z])/.test(inputValue),
        message: "Include at least one lowercase letter.",
      },
      {
        condition: !/(?=.*[A-Z])/.test(inputValue),
        message: "Include at least one uppercase letter.",
      },
      {
        condition: !/(?=.*\d)/.test(inputValue),
        message: "Include at least one digit.",
      },
      {
        condition: !/(?=.*[@$!%*?&])/.test(inputValue),
        message: "Include at least one special character (@$!%*?&).",
      },
      {
        condition: inputValue.length < 8,
        message: "Password must be at least 8 characters long.",
      },
      {
        condition: !passwordPattern.test(inputValue),
        message: "Invalid password",
      },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast.error(validation.message);
        setDisableBtn(true);
        return;
      }
    }

    toast.success("Valid password!");
    setDisableBtn(false);
  };

  const handleUserAuthLogin = async (e) => {
    e.preventDefault();

    if (!emailOrPhone) {
      if (isEmail) {
        if (!email || !password) {
          return toast.error("Please enter your email and password!");
        }
      } else {
        return toast.error("Please enter your phone number!");
      }
      // return toast.error("Please provide credentials!");
    }

    setSubmitting(true);
    const login = async () => {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email: isEmail ? email : "",
          phone_number: !isEmail ? emailOrPhone : "",
          otp,
          password,
        });
        console.log("res:", res);

        if (res?.error) {
          if (res.error === "OTP_SENT") {
            toast.info("OTP sent to your phone. Please enter the OTP.");
            setShowOtpInput(true);
            setSubmitting(false);
            setDisableBtn(false);
            return;
          }

          throw new Error(res.error);
        }

        if (res?.url) {
          console.log(res?.url);

          // setSubmitting(true);
          setSuccess(true);

          router.replace("/");
          router.refresh();
          return "Logged in successfully!";
        }
      } catch (error) {
        // console.error("Something went wrong, please try again!");
        console.log("error:", error.message);

        throw new Error(error.message + "");
      } finally {
        setSubmitting(false);
      }
    };
    toast.promise(login(), {
      pending: "Logging in...",
      success: "Logged in successfully!",
      error: {
        render({ data }) {
          // `data` contains the error object
          return data.message || "Something went wrong, please try again!";
        },
      },
    });
  };

  return (
    <CommonLayout parent="home" title="login">
      <section className="login-page section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <h3>Login</h3>
              <div className="theme-card">
                <Form className="theme-form">
                  <div className="form-group">
                    <Label className="form-label" for="email">
                      Email or Phone
                    </Label>
                    <Input
                      type="text"
                      name="email"
                      className="form-control"
                      placeholder="Enter email or phone"
                      required
                      value={emailOrPhone}
                      onChange={handleEmailOrPhone}
                    />
                  </div>
                  {isEmail && (
                    <div className="form-group">
                      <Label className="form-label" for="review">
                        Password
                      </Label>
                      <Input
                        type="password"
                        defaultValue={password}
                        onChange={handlePassword}
                        className="form-control"
                        id="review"
                        placeholder="Enter your password"
                        required=""
                      />
                    </div>
                  )}
                  {showOtpInput && (
                    <div className="form-group">
                      <Label className="form-label" for="otp">
                        Enter OTP
                      </Label>
                      <Input
                        type="text"
                        name="otp"
                        className="form-control"
                        placeholder="Enter OTP"
                        required
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(/[^\d]/g, "").slice(0, 6)
                          )
                        }
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-solid"
                    onClick={handleUserAuthLogin}
                    disabled={disableBtn || submitting || success}
                  >
                    {submitting
                      ? "Logging in..."
                      : success
                      ? "Logged in"
                      : "Login"}
                  </button>
                  <div className="footer-social">
                    <ul>
                      <li>
                        <button
                          type="button"
                          onClick={() => signIn("google")}
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        >
                          <i
                            className="fa fa-google-plus"
                            aria-hidden="true"
                          ></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </Form>
              </div>
            </Col>
            <Col lg="6" className="right-login">
              <h3>New Customer</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font">Create A Account</h6>
                <p>
                  Sign up for a free account at our store. Registration is quick
                  and easy. It allows you to be able to order from our shop. To
                  start shopping click register.
                </p>
                <Link href="/page/account/register" className="btn btn-solid">
                  Create an Account
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};
export default Login;
