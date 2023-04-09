function TitlesComp({ titles, cssProps }: { titles: string[], cssProps: string }) {
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