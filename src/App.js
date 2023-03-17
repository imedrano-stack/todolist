import React, { useEffect, useState, Fragment } from "react";
import { db, app, auth } from "./firebase";

import SignIn from "./components/Login/SignIn";
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
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { set } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";

// import firebase from "firebase/app";
// import Home from "./Home";

// const auth = getAuth();

const App = () => {
  const [courseGoals, setCourseGoals] = useState([
    // { text: "Do all exercises!", id: "g1" },
    // { text: "Finish the course!", id: "g2" },
  ]);
  const [authUser, setAuthUser] = useState(null);

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

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
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

  const signInHandler = (event, email, password, auth) => {
    event.preventDefault();
    console.log("Email: ", email);
    console.log("Password: ", password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => console.log(error));
  };

  const signUpHandler = (event, email, password, auth) => {
    event.preventDefault();
    console.log("Email: ", email);
    console.log("Password: ", password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => console.log(error));
  };

  // const userEmail = authUser.email;

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign Out successful");
      })
      .catch((error) => console.log(error));
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
        onLogOut={userSignOut}
      />
    );
  }

  return (
    <div>
      {authUser ? (
        <>
          <section id="goal-form">
            <CourseInput onAddGoal={addGoalHandler} user={authUser.email} />
          </section>
          <section id="goals">{content}</section>
        </>
      ) : (
        <React.Fragment>
          <SignIn
            id={"loginButton"}
            label={"Log In"}
            message={"Enter your account"}
            onSign={signInHandler}
          />
          <SignIn
            id={"registerButton"}
            label={"Register"}
            message={"Register your account"}
            onSign={signUpHandler}
          />
        </React.Fragment>
      )}
      {/* <Login /> */}
    </div>
  );
};

export default App;
