import React, { useState } from "react";
import { useRouter } from "next/router";
import CommonLayout from "../../../components/shop/common-layout";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { emailPattern, passwordPattern } from "./login";
import { toast } from "react-toastify";

const Register = () => {
  const router = useRouter();

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [termsChecked, setTermsChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [checkOtpCode, setCheckOtpCode] = useState("");

  const [otpBtn, setOtpBtn] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmail = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (inputValue.trim() === "") {
      setDisableBtn(true);
      return;
    }

    if (!emailPattern.test(inputValue)) {
      toast.error("Invalid email");
      setDisableBtn(true);
    } else {
      toast.success("Valid email");
      setDisableBtn(false);
    }
  };

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

  const handleGetOtp = async (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !email || !password) {
      return toast.error("Please fill all the fields!");
    }
    // if (!termsChecked) {
    //   return toast.error("Terms & Conditions should be checked!");
    // }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name, last_name, email, password }),
      });

      if (res.status === 400) {
        setSendingOtp(false);
        toast.error(`${email} is already registered!`);
      } else if (res.status === 201) {
        const otpCheck = await res.json();
        setCheckOtpCode(otpCheck);
        setOtpBtn(true);
        setOtpSuccess(true);
        toast.success(`OTP has been sent to your ${email}, check your email!`);
      }
    } catch (error) {
      setSendingOtp(false);
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    }
  };

  const handleUserAuthRegister = async (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !email || !password) {
      return toast.error("Please fill all the fields!");
    }
    // if (password !== confirmPassword) {
    //   return toast.error("Passwords does not match!");
    // }

    setSubmitting(true);

    const register = async () => {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name,
            last_name,
            email,
            password,
            otp,
            checkOtpCode,
          }),
        });

        if (res.status === 400) {
          setSubmitting(false);
          throw new Error(`${email} is already registered!`);
        }

        if (res.status === 200) {
          setSuccess(true);
          router.push("page/account/login");
          router.refresh();
          return "Registered successfully!";
        } else {
          setSubmitting(false);
          throw new Error("Something went wrong, please try again!");
        }
      } catch (error) {
        setSubmitting(false);
        throw error;
      }
    };

    toast.promise(register(), {
      pending: "Registering...",
      success: "Registered successfully!",
      error: "Something went wrong, please try again!",
      // error: (error: any) => error.message || 'An error occurred.',
    });
  };

  return (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3>create account</h3>
              <div className="theme-card">
                <Form className="theme-form">
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="email">
                        First Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="first_name"
                        placeholder="First Name"
                        required
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                        disabled={otpBtn}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="review">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="lname"
                        placeholder="Last Name"
                        required
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
                        disabled={otpBtn}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="email">
                        E-mail
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={handleEmail}
                        disabled={otpBtn}
                      />
                    </Col>
                    <Col md="6">
                      <Label className="form-label" for="review">
                        Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="review"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={handlePassword}
                        disabled={otpBtn}
                      />
                    </Col>
                    {!otpBtn || !otpSuccess ? (
                      <Col md="12">
                        <button
                          type="button"
                          onClick={handleGetOtp}
                          disabled={otpBtn || sendingOtp || otpSuccess}
                          className="btn btn-solid w-auto"
                        >
                          {sendingOtp
                            ? "Sending OTP..."
                            : otpSuccess
                            ? "Check your E-mail!"
                            : "Send OTP"}
                        </button>
                      </Col>
                    ) : (
                      <>
                        <Col md="6">
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            disabled={disableBtn || submitting || success}
                            value={otp}
                            onChange={(e) =>
                              setOtp(
                                e.target.value.replace(/[^\d]/g, "").slice(0, 4)
                              )
                            }
                            required
                            className="input-style animate-slide-down"
                          />
                        </Col>
                        <Col md="12">
                          <button
                            type="submit"
                            onClick={handleUserAuthRegister}
                            disabled={disableBtn || submitting || success}
                            className="btn btn-solid w-auto"
                          >
                            {submitting
                              ? "Creating account..."
                              : success
                              ? "Registered Successfully!"
                              : "Create Account"}
                          </button>
                        </Col>
                      </>
                    )}
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;
