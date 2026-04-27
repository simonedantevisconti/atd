import { useMemo } from "react";

const VolunteerSelect = ({ label, list, value, onSelect, datalistId }) => {
  const norm = (s) =>
    String(s || "")
      .trim()
      .toLowerCase();

  const options = useMemo(() => {
    return list || [];
  }, [list]);

  return (
    <div className="volunteer-select">
      <input
        className="form-control form-control-sm w-100"
        placeholder={label}
        list={datalistId}
        value={value || ""}
        onChange={(e) => onSelect(e.target.value)}
        onFocus={(e) => e.target.select()}
      />

      <datalist id={datalistId}>
        {options.map((v) => {
          const labelValue = `${v.nome || ""}${
            v.cognome ? " " + v.cognome : ""
          }`.trim();

          return <option key={v.id ?? labelValue} value={labelValue} />;
        })}
      </datalist>
    </div>
  );
};

export default VolunteerSelect;
