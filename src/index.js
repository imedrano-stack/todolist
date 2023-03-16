import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker.register("/serviceWorker.js").then(
//       function (registration) {
//         console.log(
//           "Service worker registered with scope: ",
//           registration.scope
//         );
//       },
//       function (err) {
//         console.log("Service worker registration failed: ", err);
//       }
//     );
//   });
// }
