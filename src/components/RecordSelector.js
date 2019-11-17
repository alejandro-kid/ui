import React, {useState} from 'react';
import {DataType} from "../services/DataTypeService";
import {InputBase, LinearProgress} from "@material-ui/core";
import RefPicker from "./RefPicker";

const RecordSelector = ({ dataTypeId, dataTypeSelector, onSelect, text, inputClasses, disabled, readOnly }) => {
    const [dataType, setDataType] = useState(null);

    if (dataType) {
        return <RefPicker dataType={dataType}
                          onPick={onSelect}
                          text={text}
                          inputClasses={inputClasses}
                          disabled={disabled}
                          readOnly={readOnly}/>;
    }

    let fetchDataType;

    if (dataTypeId) {
        fetchDataType = DataType.getById(dataTypeId);
    } else {
        fetchDataType = DataType.find(dataTypeSelector);
    }

    fetchDataType.subscribe(dt => setDataType(dt));

    return <div><InputBase disabled/><LinearProgress/></div>;
};

export default RecordSelector;
