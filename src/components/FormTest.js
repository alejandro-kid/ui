import React, {useState} from 'react';
import ObjectControl from "./ObjectControl";

const valueHash = {};

const FormTest = ({ record, title }) => {

    const [json, setJSON] = useState('{}');

    let control;

    if (record) {
        let value = valueHash[record.id];
        if (!value) {
            Object.keys(valueHash).forEach(key => delete valueHash[key]);
            valueHash[record.id] = value = {};
            handleChange(value);
        }

        control = <div style={{
            display: 'flex',
            marginTop: '10px',
            flexDirection: 'column',
            height: '90vh',
            overflow: 'auto'
        }}>
            <h3>{title}</h3>
            <ObjectControl dataTypeId={record.id}
                           value={value}
                           onChange={handleChange}/>
        </div>;
    }

    function handleChange(value) {
        setJSON(JSON.stringify(value, null, 2));
    }

    return <div style={{ display: 'flex', padding: '10px' }}>
        <div style={{ width: '50%', overflow: 'auto', height: '90vh'}}>
            {control}
        </div>
        <pre style={{ width: '50%', overflow: 'auto' }}>{json}</pre>
    </div>;
};

export default FormTest;