import React from "react";


function InputSettings(props:{for:string}) {
    return (<label>
                {props.for}
                <input type="text" value="yass"></input>
            </label> );
}



function ProfileSettings() {
    return ( <div className="profile settings">
                <img src="" alt="profilePic"></img>
                <InputSettings for="ID" />
                <InputSettings for="First Name" />
                <InputSettings for="Last Name" />
                <InputSettings for="Level" />
                <InputSettings for="Rank" />
                <InputSettings for="Phone Number" />
                <InputSettings for="Date Of Birth" />

            </div>);
}

export default ProfileSettings;