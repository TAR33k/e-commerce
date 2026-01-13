import { useState } from "react";

const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => setValue(e.target.value);

  const reset = () => setValue(initialValue);

  const bind = {
    value,
    onChange,
  };

  return { value, setValue, onChange, reset, bind };
};

export default useFormInput;
