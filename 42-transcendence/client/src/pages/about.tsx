import NavBarLayout from "@/components/Layout";

function About() {
    return ( <div>hh</div>);
}

About.getLayout = function getLayout(page : React.ReactNode) {
    return (
      <NavBarLayout>
          {page}
      </NavBarLayout>
    )
}
export default About;