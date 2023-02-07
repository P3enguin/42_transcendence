import React from "react";
import InputLabels from "./InputLabels";



function ProfileInfo() {

    return (
    <div className="profile-info profile-container">
        <img className="profile-pic" src="" alt="profile Picture"></img>
        <InputLabels _id="username profile-label" disabled={true} _value="ybensell"/>
        <InputLabels _id="first-name profile-label"  disabled={true} _value="Yasser"/>
        <InputLabels _id="last-name profile-label" disabled={true} _value="Bensellam"/>
        <InputLabels _id="level profile-label"  disabled={true} _value="level:26"/>
        <InputLabels _id="rank profile-label" disabled={true} _value="rank"/>
        <InputLabels _id="phone-number profile-label"  disabled={true} _value="060000000"/>
        <InputLabels _id="date-of-birth profile-label" disabled={true} _value="1999-99-99"/>
    </div>
    );
}

export default ProfileInfo;