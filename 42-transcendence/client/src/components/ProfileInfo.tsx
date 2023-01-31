import React from "react";
import InputLabels from "./InputLabels";



function ProfileInfo() {


    return (
    <div className="profile-info-container">
        <img className="profile-pic" src="" alt="profile Picture"></img>
        <InputLabels _className="username profile-label" disabled={true} value="ybensell"/>
        <InputLabels _className="first-name profile-label"  disabled={true} value="Yasser"/>
        <InputLabels _className="last-name profile-label" disabled={true} value="Bensellam"/>
        <InputLabels _className="level profile-label"  disabled={true} value="level:26"/>
        <InputLabels _className="rank profile-label" disabled={true} value="rank"/>
        <InputLabels _className="phone-number profile-label"  disabled={true} value="060000000"/>
        <InputLabels _className="date-of-birth profile-label" disabled={true} value="1999-99-99"/>
    </div>
    );
}

export default ProfileInfo;