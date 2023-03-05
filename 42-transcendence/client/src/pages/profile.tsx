import Image from "next/image";
import { useState,useEffect } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { getServerSession } from "next-auth";
import Layout
 from "@/components/layout/layout";
function PlayerProfile() {

    return (
        <Layout>
            <div>
                hh
            </div>
        </Layout>
    );

}

export async function getServerSideProps(context:any) {

  const jwt_token : string = context.req.cookies["jwt_token"];
  if (!jwt_token)
  {
      return {
        redirect : {
          destination : '/',
          permanent : true,
        }
      }
  }
 
  
    return {
      props: {  
        authenticated : true
      },
    };

}

export default PlayerProfile;



