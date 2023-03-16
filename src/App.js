import React, { useEffect, useState, useLayoutEffect } from "react";
import { db } from "./firebase";

import CourseGoalList from "./components/CourseGoals/CourseGoalList/CourseGoalList";
import CourseInput from "./components/CourseGoals/CourseInput/CourseInput";
import "./App.css";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const App = () => {
  const [courseGoals, setCourseGoals] = useState([
    // { text: "Do all exercises!", id: "g1" },
    // { text: "Finish the course!", id: "g2" },
  ]);

  // useEffect(() => {
  //   getGoals();
  // }, []);

  // useEffect(() => {
  //   console.log(courseGoals);
  // }, [courseGoals]);

  useEffect(() => {
    const goalCollectionRef = collection(db, "goals");
    const unsubscribe = onSnapshot(goalCollectionRef, (snapshot) => {
      setCourseGoals(
        snapshot.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
          color: doc.data().color,
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getGoals = () => {
    const goalCollectionRef = collection(db, "goals");
    getDocs(goalCollectionRef)
      .then((response) => {
        const gls = response.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }));
        setCourseGoals(gls);
      })
      .catch((error) => console.log(error.message));
  };

  const addGoalHandler = (title) => {
    // setCourseGoals((prevGoals) => {
    //   const updatedGoals = [...prevGoals];
    //   updatedGoals.unshift({ text: enteredText, id: Math.random().toString() });
    //   return updatedGoals;

    const goalCollRef = collection(db, "goals");
    addDoc(goalCollRef, { title, color: false })
      .then((response) => {
        console.log(response);
        // window.location.reload();
        getGoals();
      })
      .catch((error) => {
        console.log(error.message);
      });
    // });
  };

  const deleteItemHandler = (goalId) => {
    const docRef = doc(db, "goals", goalId);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document Deleted");
        // window.location.reload();
        getGoals();
      })
      .catch((error) => console.log(error.message));

    // setCourseGoals((prevGoals) => {
    //   const updatedGoals = prevGoals.filter((goal) => goal.id !== goalId);
    //   return updatedGoals;
    // });
  };

  const updateGoalColorHandler = (goalId) => {
    const docRef = doc(db, "goals", goalId);
    updateDoc(docRef, { color: true })
      .then(() => {
        console.log("Goal color updated");
      })
      .catch((error) => console.log(error.message));
  };

  let content = (
    <p style={{ textAlign: "center" }}>No goals found. Maybe add one?</p>
  );

  if (courseGoals.length > 0) {
    content = (
      <CourseGoalList
        items={courseGoals}
        onDeleteItem={deleteItemHandler}
        onUpdateColorItem={updateGoalColorHandler}
      />
    );
  }

  return (
    <div>
      <section id="goal-form">
        <CourseInput onAddGoal={addGoalHandler} />
      </section>
      <section id="goals">
        {content}
        {/* {courseGoals.length > 0 && (
          <CourseGoalList
            items={courseGoals}
            onDeleteItem={deleteItemHandler}
          />
        ) // <p style={{ textAlign: 'center' }}>No goals found. Maybe add one?</p>
        } */}
      </section>
    </div>
  );
};

export default App;
