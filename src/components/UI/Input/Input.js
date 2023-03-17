import React from "react";

import classes from "./Input.module.css";

const Input = (props) => {
  return (
    <div className={classes.control}>
      <label htmlFor={props.id}>{props.label}</label>
      <input type={props.type} onChange={props.onChange} />
    </div>
  );
};

export default Input;
