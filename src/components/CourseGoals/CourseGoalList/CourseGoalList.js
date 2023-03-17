import React from "react";
import Button from "../../UI/Button/Button";

import CourseGoalItem from "../CourseGoalItem/CourseGoalItem";
import "./CourseGoalList.css";

const CourseGoalList = (props) => {
  return (
    <>
      <ul className="goal-list">
        {props.items.map((goal) => (
          <CourseGoalItem
            key={goal.id}
            id={goal.id}
            onDelete={props.onDeleteItem}
            onUpdateColor={props.onUpdateColorItem}
            color={goal.color}
          >
            {goal.data.title}
          </CourseGoalItem>
        ))}
      </ul>
      <Button onClick={props.onLogOut}>Log out</Button>
    </>
  );
};

export default CourseGoalList;
