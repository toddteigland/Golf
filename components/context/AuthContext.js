import React, { createContext, useState } from "react";

// export const userContext = React.createContext({
//   username: null,
//   // handicap: null,
// });

// export function AuthContext(props) {
//   // const [username, setUsername] = useState(userInitialState);

//   // function setUser(name) {
//   //   const newState = { ...user, username };
//   //   setUsername(newState);
//   // }

//   const userContextSetters = {
//     setUsername,
//     setUser,
//     username,
//   };

//   return (
//     <userContext.Provider value={userContextSetters}>
//       {props.children}
//     </userContext.Provider>
//   );
// }
// export const { setUsername, setUser, username } = userContextSetters;

export const AuthContext = createContext({});