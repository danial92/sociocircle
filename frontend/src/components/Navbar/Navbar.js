import React, { useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import "./Navbar.css";
import { UserContext } from "../../App";

function Navbar() {
    const history = useHistory();

    const { state, dispatch } = useContext(UserContext);

    const renderList = () => {
        if(state) {
            return [
               <li><Link to="/createpost">Create Post</Link></li>,
               <li><Link to="/profile">My Profile</Link></li>,
               <li><Link to="/followingposts">Following's Posts</Link></li>,
               <li><Link
                onClick={
                    () => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        history.push("/login")
                    }
                }
               >Logout</Link></li>
            ]
        } else {
            return [
                <li><Link to="/login">Login</Link></li>,
                <li><Link to="/register">Register</Link></li>
            ]
        } 
    }

    return (
        <div className="navbar">
            <h5><Link to={state ? "/" : "/login"}>Socio_CIRCLE</Link></h5>
            <ul>
                {renderList()}
            </ul>
        </div>
    )
}

export default Navbar;