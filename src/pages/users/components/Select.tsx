export const Select = ({ name, options, handleChange, name_form }) => {
  return (
    <div className="input-group input-group-static mb-4 has-validation">
      <label htmlFor={name_form} className="ms-0">
        {name}
      </label>
      <select
        name={name_form}
        className="form-control"
        id={name_form}
        onChange={handleChange}
      >
        {options.map((faculty, i) => (
          <option key={i} value={faculty.value}>
            {faculty.label}
          </option>
        ))}
      </select>
    </div>
  );
};
