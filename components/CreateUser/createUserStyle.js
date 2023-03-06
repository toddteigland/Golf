import { StyleSheet } from "react-native"

const createUserStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
  },
  textbox: {
    width: 150,
    backgroundColor: 'white',
    margin: 15,
  }
});

export {createUserStyle};