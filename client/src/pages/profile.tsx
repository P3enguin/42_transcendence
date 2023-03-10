import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/layout";
import { verifyToken } from "@/components/VerifyToken";

function PlayerProfile({ jwt_token }: { jwt_token: string }) {
  return (
    <Layout>
      <div>hh</div>
    </Layout>
  );
}

export async function getServerSideProps({ req }: any) {
  const jwt_token: string = req.cookies["jwt_token"];

  if (jwt_token) {
    const res = await verifyToken(req.headers.cookie);
    if (res.ok) {
      return {
        // modify this to return anything you want before your page load
        props: {
          jwt_token: jwt_token,
        },
      };
    }
  }
  return {
    redirect: {
      destination: "/",
      permanent: true,
    },
  };
}
export default PlayerProfile;
