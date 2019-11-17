import React, { useEffect, useState } from 'react';
import { IconButton, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClearIcon from '@material-ui/icons/Clear';
import ObjectControl, { FETCHED } from "./ObjectControl";
import '../util/FlexBox.css';
import { map, switchMap } from "rxjs/operators";

function EmbedsOneControl({ rootDataType, jsonPath, title, value, errors, property, onDelete, onChange, width, disabled, onStack, rootId, readOnly }) {

    const [isEdit, setEdit] = useState(value);
    const [valueTitle, setValueTitle] = useState('');
    const [open, setOpen] = useState(false);
    const valueKey = JSON.stringify(value);

    useEffect(() => {
        let subscription;
        if (value) {
            subscription = property.dataType.titleFor(value).subscribe(title => setValueTitle(title));
        } else {
            setValueTitle('');
        }
        return () => subscription && subscription.unsubscribe();
    }, [value, property, valueKey]);

    const addNew = () => {
        onChange({ [FETCHED]: true });
        setTimeout(() => setOpen(true));
    };

    const handleStack = item => onStack({
        ...item,
        title: itemValue => item.title(itemValue).pipe(
            switchMap(itemTitle => property.dataType.titleFor(value).pipe(
                map(title => `[${property.name}] ${title} ${itemTitle}`)
            )))
    });

    const handleDelete = () => {
        setEdit(false);
        onDelete();
    };

    let objectControl, actionButton, deleteButton;

    if (value) {
        if (open) {
            objectControl = <ObjectControl rootDataType={rootDataType}
                                           jsonPath={jsonPath}
                                           property={property}
                                           value={value}
                                           errors={errors}
                                           onChange={onChange}
                                           width={width}
                                           disabled={disabled}
                                           readOnly={readOnly}
                                           onStack={handleStack}
                                           rootId={isEdit ? rootId : null}/>;
            actionButton =
                <IconButton onClick={() => setOpen(false)} disabled={disabled}><ArrowDropUpIcon/></IconButton>;
        } else {
            actionButton =
                <IconButton onClick={() => setOpen(true)} disabled={disabled}><ArrowDropDownIcon/></IconButton>;
        }
        if (!readOnly) {
            deleteButton = <IconButton onClick={handleDelete} disabled={disabled}><ClearIcon/></IconButton>;
        }
    } else {
        valueTitle.length && setValueTitle('');
        if (!readOnly) {
            actionButton = <IconButton onClick={addNew} disabled={disabled}><AddIcon/></IconButton>;
        }
    }

    return (
        <div className='flex full-width column'>
            <div className='flex full-width'>
                <TextField label={title}
                           readOnly
                           className='grow-1'
                           value={valueTitle}
                           placeholder={valueTitle || (!value && String(value)) || valueTitle}
                           error={(errors && Object.keys(errors).length > 0) || false}/>
                {actionButton}
                {deleteButton}
            </div>
            {objectControl}
        </div>
    );
}

export default EmbedsOneControl;
