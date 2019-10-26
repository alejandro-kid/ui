import React from 'react';
import { DataType, Property } from '../services/DataTypeService';
import { LinearProgress } from '@material-ui/core';
import PropertyControl from './PropertyControl'
import ErrorMessages from "./ErrorMessages";
import { FormGroup } from "./FormGroup";

class DataTypeControl extends React.Component {

    static getDerivedStateFromProps(props, state) {
        state.self.checkProps(props);
        return null;
    }

    constructor(props) {
        super(props);
        this.state = { self: this };
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    checkProps(props) {
        const resolver = props.dataType || props.property;
        if (!this.schemaResolver ||
            (resolver && this.schemaResolver !== resolver) ||
            this.schemaResolver.id !== props.dataTypeId) {
            if (resolver) {
                this.setSchemaResolver(resolver);
            } else {
                DataType.getById(props.dataTypeId)
                    .then(dataType => this.setSchemaResolver(dataType));
            }
        }
    }

    getDataType() {
        return this.schemaResolver &&
            (this.schemaResolver.constructor === Property ? this.schemaResolver.dataType : this.schemaResolver);
    }

    setSchemaResolver(resolver) {
        this.schemaResolver = resolver;
        this.setSchema(resolver);
    }

    setSchema = (resolver = null) => {
        (resolver || this.schemaResolver || this.props.dataType || this.props.property)
            .getSchema()
            .then(schema => {
                this.schema = schema;
                this.schemaReady();
            });
    };

    schemaReady() {

    }

    doSetState = state => !this.unmounted && this.setState(state);

    resolveProperties(properties) {
        this.doSetState({ properties });
    }

    handleChange = prop => v => {
        const { value, onChange } = this.props;
        value[prop] = v;
        onChange && onChange(value);
        this.refresh();
    };

    handleDelete = prop => () => {
        const { value, onChange } = this.props;
        delete value[prop];
        onChange && onChange({ ...value });
    };

    refresh = () => this.doSetState({});

    render() {
        const { properties } = this.state;
        const { value, width, disabled } = this.props;
        const errors = this.props.errors || {};

        if (properties) {

            const controls = properties.map(
                prop => <PropertyControl property={prop}
                                         key={prop.name}
                                         value={value[prop.name]}
                                         errors={errors[prop.name]}
                                         width={width}
                                         onChange={this.handleChange(prop.name)}
                                         onDelete={this.handleDelete(prop.name)}
                                         disabled={disabled}/>
            );

            return <FormGroup error={Object.keys(errors).length > 0}>
                <ErrorMessages errors={errors.$}>
                    {controls}
                </ErrorMessages>
            </FormGroup>;
        }

        return <LinearProgress/>;
    }
}

export default DataTypeControl;
