import "./AboutUs.css";

import React from "react";
import ProfileCard from "./ProfileCard";
import img4 from "../../images/developer-team.svg";
import img5 from "../../images/business-deal.svg";
import "./AboutUs.module.css";
import "../HomePage/assets/js/main";
import HeaderMegaMenu from "../HomePage/HeaderMegaMenu";

const AboutUS = () => {
  const visible = true;
  return (
    <>
      <HeaderMegaMenu />

      <div className="aboutUsMainView">
        <div className="aboutus-section">
          <div
            className="leftPartAboutUS"
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <div className="aboutUsDiv">
              <h1 className="aboutus-title">About Me</h1>
              <p className="aboutus-text">
                I am a developer who is passionate about building applications
                that are useful to the community. I am currently working on a
                project that will help people find the best deals on their
                favorite products. I am currently working on a project that will
                help people find the best deals on their favorite products. I am
                currently working on a project that will help people find the
                best deals on their favorite products.
              </p>
            </div>
            <img src={img4} alt="developer-team" className="img4" />
          </div>
          <div
            className="rightPartAboutUS"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <img src={img5} alt="developer-team" className="img4" />
            <div className="aboutUsDiv">
              <h1 className="aboutus-title">Mission</h1>
              <p className="aboutus-text">
                I am a developer who is passionate about building applications
                that are useful to the community. I am currently working on a
                project that will help people find the best deals on their
                favorite products. I am currently working on a project that will
                help people find the best deals on their favorite products. I am
                currently working on a project that will help people find the
                best deals on their favorite products.
              </p>
            </div>
          </div>
        </div>
        <div className="team-section">
          <h2 className="aboutus-title">Here is my Profile</h2>

          <div className="inner-width">
            <div className="teams">
              <div className="team">
                <div className="containerAboutUs">
                  <div
                    data-aos="zoom-in"
                    data-aos-duration="1000"
                    data-aos-delay="600"
                  >
                    <ProfileCard
                      name={"Dushyant Yadav"}
                      email={"dushyant@atmos.in"}
                      image={
                        "https://img.icons8.com/cotton/64/000000/winter-outfit-man--v2.png"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUS;
