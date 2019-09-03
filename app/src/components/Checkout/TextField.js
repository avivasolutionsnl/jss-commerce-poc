import React from 'react';

export default function TextField({id, name, value, onChange, readOnly}) { 
    return <div className="textfield">
        <label htmlFor={id}>{name}</label>
        <input
            type="text"
            name={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
        />
    </div>
}