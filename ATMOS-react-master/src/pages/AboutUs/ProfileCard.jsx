import React, { useState, useEffect } from 'react';
import { BsLinkedin, BsGithub } from "react-icons/bs";

const ProfileCard = ({ name, email, image }) => {
    return (
        <>
            <div className="boxAboutUs">
                <div className="top-barAboutUs"></div>
                <div className="topAboutUs">
                </div>
                <div className="contentAboutUs">
                    <img src={image} alt="" />
                    <strong>{name}</strong>
                    <p>{email}</p>
                </div>
                <div className='btnAboutUs'>
                    <a href="https://www.linkedin.com/in/dushyant-yadav-963b98202/" rel="noreferrer"><BsLinkedin /></a>
                    <a href="#" rel="noreferrer"><BsGithub /></a>
                </div>
            </div>
        </>
    );
}

export default ProfileCard;