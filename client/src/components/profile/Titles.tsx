
function TitlesComp({titles,cssProps}:{titles:Array<string>,cssProps:string}) {
    return (  <select
        id="title"
        className={cssProps}
      >
        <option
          value="select a title"
          defaultValue={'select a title'}
          disabled
          id="titles"
          hidden
        >
          select a title
        </option>
        {titles.map((elem, index) => (
          <option key={index} value={elem}>
            {elem}
          </option>
        ))}
      </select> );
}

export default TitlesComp;