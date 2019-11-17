import React, { useState } from 'react';
import API from "../services/ApiService";
import RecordSelector from "./RecordSelector";

const TenantTypeSelector = { namespace: '""', name: 'Account' };

const TenantSelector = ({ inputClasses, onSelect, readOnly }) => {
    const [tenant, setTenant] = useState({ name: 'Loading...', fetchCurrentTenant: true });

    function handleSelect(selection) {
        setTenant({ name: selection.record.name, disabled: true });
        API.post('setup', 'user', 'me', {
            account: {
                id: selection.record.id
            }
        }).subscribe(() => selectTenant(selection.record));
    }

    function selectTenant(tenant) {
        setTenant(tenant);
        onSelect(tenant);
    }

    if (tenant.fetchCurrentTenant) {
        API.get('setup', 'user', 'me').subscribe(user => user && selectTenant(user.account));
    }

    return <RecordSelector dataTypeSelector={TenantTypeSelector}
                           inputClasses={inputClasses}
                           text={tenant.name}
                           onSelect={handleSelect}
                           disabled={tenant.disabled}
                           readOnly={readOnly}/>;
};

export default TenantSelector;
