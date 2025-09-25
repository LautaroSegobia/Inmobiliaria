
import { useState } from "react";

export default function useForm(initialValues, validate, onSubmit) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(form);
      setForm(initialValues);
    }
  };

  return {
    form,
    setForm,
    errors,
    handleChange,
    handleSubmit,
  };
}
