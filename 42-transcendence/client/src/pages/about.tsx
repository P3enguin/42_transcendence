import NavBarLayout from "@/components/Layout";
import Image from "next/image";
import { AnimatePresence, motion ,AnimateSharedLayout} from 'framer-motion'

function About() {
    return ( <div>
            <div className=" px-4 shrink-0 mt-10 justify-end">
            <AnimateSharedLayout>
                <AnimatePresence>
                  <motion.div 
                    key="img"
                    layoutId='test'
                    initial={true}
                    animate={{y:300,rotate:90}}
                    transition={{ type: "spring", stiffness: 50 }}
                    exit={{rotate:0}}>
                    <Image 
                      src="/game.png"
                      alt='game'
                      width={700}
                      height={600}
                    />
                  </motion.div>
                </AnimatePresence>
              </AnimateSharedLayout>
            </div>
    </div>);
}

About.getLayout = function getLayout(page : React.ReactNode) {
    return (
      <NavBarLayout>
          {page}
      </NavBarLayout>
    )
}
export default About;