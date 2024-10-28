"use client"

import { Href } from "@/Constants";
import { Button, Form, FormGroup, Input, InputGroup, InputGroupText, Label } from "reactstrap";
import SocialMediaIcons from "./SocialMediaIcons";
import { ChangeEvent, useState } from "react";
import { emailPattern, passwordPattern } from "./LoginForm";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";

const RegisterForm = () => {
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

    if (inputValue.trim() === "") {
      setDisableBtn(true);
    } else if (!/(?=.*[a-z])/.test(inputValue)) {
      toast.error("Include at least one lowercase letter.");
      setDisableBtn(true);
    } else if (!/(?=.*[A-Z])/.test(inputValue)) {
      toast.error("Include at least one uppercase letter.");
      setDisableBtn(true);
    } else if (!/(?=.*\d)/.test(inputValue)) {
      toast.error("Include at least one digit.");
      setDisableBtn(true);
    } else if (!/(?=.*[@$!%*?&])/.test(inputValue)) {
      toast.error("Include at least one special character (@$!%*?&).");
      setDisableBtn(true);
    } else if (inputValue.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setDisableBtn(true);
    } else if (!passwordPattern.test(inputValue)) {
      toast.error("Invalid password");
      setDisableBtn(true);
    } else {
      toast.success("Valid password!");
      setDisableBtn(false);
    }
  };

  return (
    <Form className="form-horizontal auth-form">
      <FormGroup>
        <Input required name="login[name]" type="email" className="form-control" placeholder="Name" id="exampleInputEmail12" />
      </FormGroup>
      <FormGroup>
      <Input required onChange={handleEmail} type="email" value={email}  placeholder="E-mail" />
      </FormGroup>
      <FormGroup>
      <InputGroup onClick={() => setShowPassWord(!showPassWord)}>
          <Input required onChange={handlePassword} type={showPassWord ? "text" : "password"} value={password}  
          placeholder="Password" />
          <InputGroupText>{showPassWord ? <Eye /> : <EyeOff />}</InputGroupText>
        </InputGroup>
      </FormGroup>
      <div className="form-terms">
        <div className="custom-control custom-checkbox me-sm-2">
          <Label className="d-block">
            <Input className="checkbox_animated" id="chk-ani2" type="checkbox" />I agree all statements in{" "}
            <span>
              {/* <a href={Href}> */}
                Terms &amp; Conditions
                {/* </a> */}
            </span>
          </Label>
        </div>
      </div>
      <div className="form-button">
        <Button color="primary" type="submit">
          Register
        </Button>
      </div>
      <div className="form-footer">
        <span>Or Sign up with Google</span>
        <SocialMediaIcons />
      </div>
    </Form>
  );
};

export default RegisterForm;
