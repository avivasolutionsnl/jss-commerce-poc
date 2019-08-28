import React from 'react';

export default ({ initialValues, onSubmit, validate }) => {
    const [values, setValues] = React.useState(initialValues || {});
    const [errors, setErrors] = React.useState({});

    const handleChange = event => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const e = validate(values);
        setErrors({
            ...errors,
            ...e
        });
        await onSubmit(values, e, setErrors);
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit
    };
};
