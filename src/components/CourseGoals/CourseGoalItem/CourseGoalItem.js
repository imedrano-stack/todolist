import React, { useState, useEffect } from "react";

import "./CourseGoalItem.css";
import Button from "../../UI/Button/Button";

const CourseGoalItem = (props) => {
  // const [deleteText, setDeleteText] = useState('');

  const [background, setBackground] = useState("#8b005d");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (props.color) {
      setBackground("#4cd62d");
    }
  }, [props.color]);

  const handleColorChange = () => {
    setBackground("#4cd62d");
    props.onUpdateColor(props.id);
  };

  const deleteHandler = () => {
    // setDeleteText('(Deleted!)');
    props.onDelete(props.id);
  };

  // const listItemStyle = {
  //   background: color || "green",
  //   fontSize: "16px",
  // };

  return (
    <>
      <li className="goal-item" style={{ background }} onClick={deleteHandler}>
        {props.children}
      </li>
      {/* <Button onClick={handleColorChange}>Task completed</Button> */}
      <button
        type={props.type}
        className="goal-button"
        onClick={handleColorChange}
      >
        Completed!
      </button>
    </>
  );
};

export default CourseGoalItem;
