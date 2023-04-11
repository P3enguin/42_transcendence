import { useState,useEffect } from "react";


function TitlesComp( {cssProps}: {  cssProps: string }) {
  const [titles,setTitles] = useState([""]);
  useEffect(() => {
    async function getTitles() {
      const response = await fetch('')
    }
  })
  return (
    <select id="title" className={cssProps}>
      <option value="">Select a title</option>
      {titles.map((title, index) => (
        <option key={index} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
}

export default TitlesComp;