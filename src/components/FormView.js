import React from 'react';
import ObjectControl from "./ObjectControl";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: ({ height }) => height ? `calc(${height})` : 'unset',
        width: ({ width }) => width ? `calc(${width})` : 'unset',
        overflow: 'auto'
    }
}));

const FormView = ({ dataType, width, value, errors, onChange, disabled, onStack, rootId, readOnly }) => {

    const classes = useStyles();

    let control;

    if (dataType) {
        control = <ObjectControl rootDataType={dataType}
                                 jsonPath='$'
                                 dataTypeId={dataType.id}
                                 width={width}
                                 value={value}
                                 errors={errors}
                                 onChange={handleChange}
                                 disabled={disabled}
                                 readOnly={readOnly}
                                 onStack={onStack}
                                 rootId={rootId}/>;
    }

    function handleChange(value) {
        onChange && onChange(value);
    }

    return <div className={classes.root}>
        {control}
    </div>;
};

export default FormView;
