import NavBarLayout from "@/components/Layout";
import Image from "next/image";
function About() {
    return ( <div>
            <div className=" px-4 shrink-0">
              <Image 
                src="/game.png"
                alt='game'
                width={700}
                height={600}
              />
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