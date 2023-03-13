// import React, { useContext } from "react";
// import { TournamentContext } from "../context/TournamentContext";
// import Parse from "parse/react-native";


// const fetchMyTournaments = async () => {
//   const { myTournaments, setMyTournaments } = useContext(TournamentContext);

//   const currentUser = await Parse.User.currentAsync();
//   const query = new Parse.Query("Tournaments");
//   query.equalTo("players", currentUser);
//   query.find().then(
//     (results) => {
//       setMyTournaments(results);
//     },
//     (error) => {
//       console.error(error);
//     }
//   );
// }

// export default fetchMyTournaments;