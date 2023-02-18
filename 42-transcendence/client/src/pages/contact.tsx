import NavBarLayout from "@/components/Layout";

function Contact() {
    return (<div>Contact</div>);
}

Contact.getLayout = function getLayout(page : React.ReactNode) {
    return (
      <NavBarLayout>
          {page}
      </NavBarLayout>
    )
}

export default Contact;