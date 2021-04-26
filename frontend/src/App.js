import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useHistory } from "react-router-dom"
import './App.css';
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import CreatePost from "./components/CreatePost/CreatePost";
import Profile from "./components/Profile/Profile";
import OthersProfile from "./components/OthersProfile/OthersProfile";
import { BrowserRouter, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar";
import { initialState, reducer } from "./reducer/reducer";
import FollowingPosts from "./components/FollowingPosts/FollowingPosts";

export const UserContext = createContext();

function Routing() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      dispatch({ type: "USER", payload: user })
    } else {
      history.push("/login")
    }
  }, [dispatch, history])

  return (
    <div>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/otherprofile/:userid">
        <OthersProfile />
      </Route>
      <Route exact path="/followingposts">
        <FollowingPosts />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </div>
  )
}

function App() {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
          <Navbar />
          <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
