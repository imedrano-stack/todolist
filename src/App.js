import React, { useEffect, useState, Fragment } from "react";
import { db, app, auth, provider } from "./firebase";

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
  where,
  query,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { set } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";

// import firebase from "firebase/app";
// import Home from "./Home";

// const auth = getAuth();

const App = () => {
  const [courseGoals, setCourseGoals] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (authUser) {
      const goalCollectionRef = collection(db, "goals");
      const q = query(goalCollectionRef, where("uid", "==", authUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
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
    }
  }, [authUser]);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        console.log(user.uid);
      } else {
        setAuthUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const getGoals = () => {
    if (authUser) {
      const uid = authUser.uid;
      const goalCollectionRef = collection(db, "goals");
      const q = query(goalCollectionRef, where("uid", "==", uid));

      getDocs(q)
        .then((response) => {
          const gls = response.docs.map((doc) => ({
            data: doc.data(),
            id: doc.id,
          }));
          setCourseGoals(gls);
        })
        .catch((error) => console.log(error.message));
    }
  };

  const addGoalHandler = (title) => {
    if (authUser) {
      const uid = authUser.uid;

      const goalCollRef = collection(db, "goals");

      addDoc(goalCollRef, { title, color: false, uid })
        .then((response) => {
          console.log(response);
          getGoals();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  const deleteItemHandler = (goalId) => {
    const docRef = doc(db, "goals", goalId);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document Deleted");
        getGoals();
      })
      .catch((error) => console.log(error.message));
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
        setCourseGoals([]);
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

  const handleClick = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email);
      localStorage.setItem("email", data.user.email);
    });
  };

  useEffect(() => {
    setValue(localStorage.getItem("email"));
  });

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
          <button onClick={handleClick}>Sign In with Google</button>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
