import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { emailPattern, passwordPattern } from "./login";
import CommonLayout from "../../../components/shop/common-layout";

const Register = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  // const [termsChecked, setTermsChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [checkOtpCode, setCheckOtpCode] = useState("");

  const [otpBtn, setOtpBtn] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [isEmail, setIsEmail] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  // console.log(emailOrPhone);

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

    if (!first_name || !last_name || !emailOrPhone) {
      if (isEmail) {
        if (!email || !password) {
          return toast.error("Please enter your email and password!");
        }
      } else {
        return toast.error("Please enter your phone number!");
      }
    }
    // if (!termsChecked) {
    //   return toast.error("Terms & Conditions should be checked!");
    // }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          phone_number: emailOrPhone,
          isEmail,
        }),
      });

      if (res.status === 400) {
        if (isEmail) {
          toast.error(`${email} is already registered!`);
        } else {
          toast.error(`${emailOrPhone} is already registered!`);
        }
      } else if (res.status === 201) {
        const otpCheck = await res.json();
        // console.log(otpCheck, otpCheck.otpCode);

        setCheckOtpCode(otpCheck.otpCode);
        setOtpBtn(true);
        setOtpSuccess(true);
        if (isEmail) {
          toast.info(`OTP has been sent to your ${email}, check your email!`);
        } else {
          toast.info(
            `OTP has been sent to your ${emailOrPhone}, check your phone!`
          );
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleUserAuthRegister = async (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !emailOrPhone || !otp || !checkOtpCode) {
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
            phone_number: emailOrPhone,
            isEmail,
            otp,
            checkOtpCode: checkOtpCode + "",
          }),
        });

        if (res.status === 400) {
          setSubmitting(false);
          if (isEmail) {
            toast.error(`${email} is already registered!`);
          } else {
            toast.error(`${emailOrPhone} is already registered!`);
          }
        }

        if (res.status === 200) {
          setSuccess(true);
          router.push("/page/account/login");
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

  if (session) return router.replace("/");

  return (
    <CommonLayout parent="home" title="register">
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="8">
              <h3>Create account</h3>
              <div className="theme-card">
                <Form className="theme-form">
                  <Row>
                    <Col md="6">
                      <Label className="form-label" for="first_name">
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
                      <Label className="form-label" for="last_name">
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="last_name"
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
                      <Label className="form-label">Email or Phone</Label>
                      <Input
                        type="text"
                        name="email"
                        className="form-control"
                        placeholder="Enter email or phone"
                        required
                        value={emailOrPhone}
                        onChange={handleEmailOrPhone}
                        disabled={otpBtn}
                      />
                    </Col>
                    {isEmail && (
                      <Col md="6">
                        <Label className="form-label">Password</Label>
                        <Input
                          type="password"
                          className="form-control"
                          placeholder="Enter your password"
                          required
                          value={password}
                          onChange={handlePassword}
                          disabled={otpBtn}
                        />
                      </Col>
                    )}
                  </Row>

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
                        <Label className="form-label">Enter OTP</Label>
                        <Input
                          type="text"
                          placeholder="Enter OTP"
                          // disabled={disableBtn || submitting || success}
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/[^\d]/g, "").slice(0, 6)
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
                </Form>
              </div>
            </Col>
            <Col lg="4" className="right-login">
              <h3>Sign In</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font">Already have an account?</h6>
                <p>
                  Sign in to your account to access your account. and easy. It
                  allows you to be able to order from our shop. To start
                  shopping click register.
                </p>
                <Link href="/page/account/login" className="btn btn-solid">
                  Sign in
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;
