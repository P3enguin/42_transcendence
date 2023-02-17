import axios from 'axios';
import nextAuth from 'next-auth';
import { useSession,signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

function LoginContent() {
    
    // function handleClick(){
    //     console.log("hh");
    // }
    const session = useSession().data;
    return (<div className = "home-login-content">
        <div className = "login-game">
            <p>here is the game simulation</p>
        </div>
        <div className = "login-description">
            <div className = "login-description-container">
                <img src="/logo.png" alt="logo" id="logo-game"></img>
                <p className="welcome-description">
                    Welcome to our website! 
                    We are glad you are here and hope you enjoy
                    playing Pong and chatting with other users.
                    Our features include the ability to create or 
                    join games, view available games and the leader-board,
                    add friends, and view stats. 
                    There is also a chat feature that allows you to send messages,
                     create and join rooms, and view online users. Thank you for 
                    choosing our website. 
                    Have a great time!
                    </p>
            </div>
                <button id="intra-login-button" onClick={() => {signIn('42',{callbackUrl:"http://localhost:3000/login"})}}>
                    <img src="/42_Logo 1.png" alt="42-logo" id="logo-42"></img>
                    continue With Intra
                </button>
        </div>
    </div>);
}

export default LoginContent;