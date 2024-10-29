"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import SocialMediaIcons from "./SocialMediaIcons";
import { emailPattern, passwordPattern } from "./LoginForm";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [otp, setOtp] = useState("");
  const [checkOtpCode, setCheckOtpCode] = useState("");

  const [otpBtn, setOtpBtn] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleGetOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("Please fill all the fields!");
    }
    if (!termsChecked) {
      return toast.error("Terms & Conditions should be checked!");
    }

    setSendingOtp(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
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

  const handleAdminAuthRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password) {
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
            name,
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
          router.push("/auth/login");
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
    <Form
      className="form-horizontal auth-form"
      onSubmit={handleAdminAuthRegister}
    >
      <FormGroup>
        <Input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          disabled={otpBtn}
        />
      </FormGroup>
      <FormGroup>
        <Input
          required
          type="email"
          value={email}
          onChange={handleEmail}
          placeholder="E-mail"
          disabled={otpBtn}
        />
      </FormGroup>
      {!otpSuccess && (
        <>
          <FormGroup>
            <InputGroup>
              <Input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePassword}
                placeholder="Password"
              />
              <InputGroupText onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye /> : <EyeOff />}
              </InputGroupText>
            </InputGroup>
          </FormGroup>
          <div className="form-terms">
            <Label className="d-block">
              <Input
                type="checkbox"
                checked={termsChecked}
                onChange={() => setTermsChecked(!termsChecked)}
              />{" "}
              I agree to all statements in Terms & Conditions
            </Label>
          </div>
        </>
      )}
      <div className="form-button">
        {!otpBtn || !otpSuccess ? (
          <Button
            type="button"
            onClick={handleGetOtp}
            disabled={otpBtn || sendingOtp || otpSuccess}
          >
            {sendingOtp
              ? "Sending OTP..."
              : otpSuccess
              ? "Check your E-mail!"
              : "Send OTP"}
          </Button>
        ) : (
          <>
            <FormGroup>
              <Input
                type="text"
                placeholder="Enter OTP"
                disabled={disableBtn || submitting || success}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 4))
                }
                required
                className="input-style animate-slide-down"
              />
            </FormGroup>
            <Button
              type="submit"
              disabled={disableBtn || submitting || success}
            >
              {submitting
                ? "Registering..."
                : success
                ? "Registered Successfully!"
                : "Sign Up"}
            </Button>
          </>
        )}
      </div>
      <div className="form-footer">
        <span>Or Sign up with Google</span>
        <SocialMediaIcons />
      </div>
    </Form>
  );
};

export default RegisterForm;
