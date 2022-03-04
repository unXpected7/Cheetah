import "./index.css";
import React from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Input } from "../../Components";
import { useMediaQuery } from "react-responsive";

const LoginScreen = () => {
  return (
    <div className="loginScreen">
      <IoChatboxEllipsesOutline className="IChat" />
      <Input placeholder="youremail@mail.com" label={"Email"} type="email" />
      <Input placeholder="***" label={"Password"} type="password" />
      <button className="loginButton">Sign in</button>
    </div>
  );
};

const Index = () => {
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

  if (isPortrait) {
    return <LoginScreen />;
  }

  return (
    <div className="body">
      <aside className="leftScreen">
        <LoginScreen />
      </aside>
      <section className="rightScreen">
        <h1>Right Screen</h1>
      </section>
    </div>
  );
};

export default Index;
