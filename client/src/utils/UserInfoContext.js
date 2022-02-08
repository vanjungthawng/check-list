import React from "react";

const UserInfoContext = React.createContext({
  savedShows: [],
  username: "",
  email: "",
  getUserData: () => undefined,
});

export default UserInfoContext;
