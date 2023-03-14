import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SideBar from "./SideBar";
import GameNavBar from "./GameNavBar";
import NavBar from "../home/NavBar";
import React from "react";
import Router from "next/router";

function SideNavBar() {
  const [svgIndex, setSvgIndex] = useState(5);
  const [isVisible, setVisible] = useState(false);
  const pages = [
    { path: "/home", index: 0 },
    { path: "/chat", index: 1 },
    { path: "/game", index: 2 },
    { path: "/profile", index: 3 },
    { path: "/settings", index: 4 },
  ];

  const router = useRouter();

  function toggleSideBar() {
    setVisible(!isVisible);
  }
  useEffect(() => {
    const handleResize = () => {
      // Get the current screen width
      const screenWidth = window.innerWidth;

      // If the screen width is medium or larger, hide the sidebar
      if (screenWidth >= 640) {
        setVisible(true);
      } else setVisible(false);
    };

    // Add a resize event listener to the window object
    window.addEventListener("resize", handleResize);

    // Call the resize handler initially to ensure that the sidebar is hidden if necessary
    handleResize();

    // Remove the resize event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle the color of the icon based on the page we are in
  useEffect(() => {
    pages.forEach((page) => {
      if (page.path == router.pathname) setSvgIndex(page.index);
    });
  }, []);

  async function handleLogOut(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_LOGOUT_ENDPOINT;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (resp.status === 201) Router.push("/");
  }

  return (
    <div className="sm:p-10">
      {/* navbar */}
      <GameNavBar toggleSideBar={toggleSideBar} handleLogOut={handleLogOut} />

      {/* SideBar */}
      <SideBar
        isVisible={isVisible}
        svgIndex={svgIndex}
        handleLogOut={handleLogOut}
      />
    </div>
  );
}

export default SideNavBar;
