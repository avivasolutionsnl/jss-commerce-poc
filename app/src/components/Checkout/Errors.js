import React from 'react';

export default function Errors({errors}) {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    const errorLines = Object.keys(errors).map(key => errors[key]).flat();

    return <ul className="errors">
        {errorLines.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
}
