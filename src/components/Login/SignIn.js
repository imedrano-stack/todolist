import React from "react";
import { useState } from "react";

import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./SignIn.module.css";

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signHandler = (event) => {
    event.preventDefault();
    props.onSign(event, email, password, auth);
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={signHandler}>
        <label className={classes.label}>{props.message}</label>
        <Input
          id="email"
          label="E-mail"
          type="email"
          onChange={emailChangeHandler}
        ></Input>
        <Input
          id="password"
          label="Password"
          type="password"
          onChange={passwordChangeHandler}
        ></Input>
        <div className={classes.actions}>
          <Button id={props.id} type="submit" className={classes.btn}>
            {props.label}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SignIn;
