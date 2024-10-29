"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Cookies from "js-cookie";
import { signIn } from "next-auth/react";
import { useAppSelector } from "@/Redux/Hooks";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import SocialMediaIcons from "./SocialMediaIcons";

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const LoginForm = () => {
  const router = useRouter();
  const { i18LangStatus } = useAppSelector((store) => store.LangReducer);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassWord, setShowPassWord] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setEmail(inputValue);

    if (inputValue.trim() === "") {
      setDisableBtn(true);
    } else {
      if (!emailPattern.test(inputValue)) {
        toast.error("Invalid email");
        setDisableBtn(true);
      } else {
        toast.success("Valid email");
        setDisableBtn(false);
      }
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

  const handleAdminAuthLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please provide credentials!");
    }

    setSubmitting(true);
    const login = async () => {
      try {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          console.log(res.error);
          setSubmitting(false);
          throw new Error("User doesn't exist or Invalid e-mail or password!");
        }

        if (res?.url) {
          console.log(res?.url);

          setSubmitting(true);
          setSuccess(true);
          router.replace("/");
          Cookies.set("token", JSON.stringify(true));
          router.push(`${process.env.PUBLIC_URL}/${i18LangStatus}/dashboard`);
          return "Logged in successfully!";
        } else {
          setSubmitting(false);
          throw new Error("Something went wrong, please try again!");
        }
      } catch (error) {
        setSubmitting(false);
        throw error;
      }
    };
    toast.promise(login(), {
      pending: "Logging in...",
      success: "Logged in successfully!",
      error: "Something went wrong, please try again!",
      // error: (error: any) => error.message || 'An error occurred.',
    });
  };

  // const formSubmitHandle = (event: FormEvent) => {
  //   event.preventDefault();
  //   if (email === "Test@gmail.com" && password === "Test@123") {
  //     Cookies.set("token", JSON.stringify(true));
  //     router.push(`${process.env.PUBLIC_URL}/${i18LangStatus}/dashboard`);
  //     toast.success("login successful");
  //   } else {
  //     toast.error("Please Enter Valid Email Or Password");
  //   }
  // };

  return (
    <Form className="form-horizontal auth-form" onSubmit={handleAdminAuthLogin}>
      <FormGroup>
        <Input
          required
          onChange={handleEmail}
          type="email"
          value={email}
          placeholder="E-mail"
        />
      </FormGroup>
      <FormGroup>
        <InputGroup onClick={() => setShowPassWord(!showPassWord)}>
          <Input
            required
            onChange={handlePassword}
            type={showPassWord ? "text" : "password"}
            value={password}
            placeholder="Password"
          />
          <InputGroupText>{showPassWord ? <Eye /> : <EyeOff />}</InputGroupText>
        </InputGroup>
      </FormGroup>
      {/* <div className="form-terms">
        <div className="custom-control custom-checkbox me-sm-2">
          <Label className="d-block">
            <Input className="checkbox_animated" id="chk-ani2" type="checkbox" />
            Reminder Me
            <span className="pull-right">
              <Button color="transparent" className="forgot-pass p-0">
                lost your password
              </Button>
            </span>
          </Label>
        </div>
      </div> */}
      <div className="form-button">
        <Button
          color="primary"
          type="submit"
          disabled={disableBtn || submitting || success}
        >
          {submitting ? "Logging in..." : success ? "Logged in" : "Login"}
        </Button>
      </div>
      <div className="form-footer">
        <span>Or Login up with Google</span>
        <SocialMediaIcons />
      </div>
    </Form>
  );
};

export default LoginForm;
