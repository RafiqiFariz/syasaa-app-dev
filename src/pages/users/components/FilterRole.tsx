import { useEffect, useState } from "react";
import fetchAPI from "../../../fetch";
import Cookies from "js-cookie";
import ReactSelect from "react-select";
import { Select } from "./Select";
import { ErrorMessage } from "../../../components/ErrorMessage";

export const FilterRole = ({ role, onChange, value, errors }) => {
  const [options, setOptions] = useState<Array<any>>([]);
  console.log(typeof role, "value");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (role === 2) {
          const response = await fetchAPI("/api/v1/faculties", {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
            },
          });

          const data = await response.json();

          if (data) {
            setOptions(
              data.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            );
          }
          console.log(data, "data roles");
        }
        if (role === 4) {
          const response = await fetchAPI("/api/v1/major-classes", {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
            },
          });

          const data = await response.json();

          if (data) {
            setOptions(
              data.data.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))
            );
          }
          console.log(data, "data roles");
        }
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchData();
  }, [role]);

  if (role === 1) {
    return <div></div>;
  } else if (role === 2) {
    return (
      <Select
        options={options}
        name={"Faculty"}
        name_form={"faculty_id"}
        handleChange={onChange}
      />
    );
  } else if (role === 3) {
    return (
      <div className="input-group input-group-dynamic mb-4 has-validation d-flex flex-column">
        <label htmlFor="selectRoles" className="ms-0 mx-0 my-0">
          Address
        </label>
        <input
          name="address"
          value={value.address}
          onChange={onChange}
          type="text"
          className={`form-control ${
            errors["address"] ? "is-invalid" : ""
          } w-100`}
          placeholder="Address"
          aria-label="Address"
          aria-describedby="basic-addon0"
        />
        <ErrorMessage field="address" errors={errors} />
      </div>
    );
  } else if (role === 4) {
    return (
      <Select
        options={options}
        name={"Student"}
        name_form={"class_id"}
        handleChange={onChange}
      />
    );
  } else {
    return <div>not found</div>;
  }
};
