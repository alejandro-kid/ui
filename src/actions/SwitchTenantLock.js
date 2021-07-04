import ActionRegistry, { ActionKind } from "./ActionRegistry";
import API from "../services/ApiService";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { useContainerContext } from "./ContainerContext";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import UnlockIcon from "@material-ui/icons/LockOpenOutlined";
import LockIcon from "@material-ui/icons/LockOutlined";
import SwitchIcon from "@material-ui/icons/SettingsBackupRestoreOutlined";
import { TenantTypeSelector } from "../components/TenantSelector";

const SwitchLockTitle = 'Switch Lock';
const UnlockTitle = 'Unlock';
const LockTitle = 'Lock';

function contextTitle({ selectedItems, data }) { // TODO selector
    let items = selectedItems;
    if (!items.length && data?.total_pages === 1) {
        items = data.items;
    }

    let title;
    if (items.length) {
        let unlocked = 0;
        let locked = 0;
        items.forEach(tenant => {
            if (tenant.locked) {
                locked++;
            } else {
                unlocked++;
            }
        });
        if (unlocked) {
            if (locked) {
                title = SwitchLockTitle;
            } else {
                title = LockTitle;
            }
        } else {
            title = UnlockTitle;
        }
    } else {
        title = SwitchLockTitle;
    }

    return title;
}

function SwitchTenantLock({ selectedItems, record, dataType, containerContext, selector }) {

    selectedItems = record
        ? [record]
        : selectedItems || [];

    if (selectedItems.length) {
        selector = { _id: { $in: selectedItems.map(({ id }) => id) } };
    }

    const title = contextTitle(containerContext[0]);
    const action = title === UnlockTitle
        ? 'unlocked'
        : (
            title === LockTitle
                ? 'locked'
                : 'lock switched'
        );

    let message;
    if (record || selectedItems.length === 1) {
        const tenant = record || selectedItems[0];
        message = `The tenant ${tenant.name} will be ${action}.`;
    } else if (selectedItems.length) {
        message = `The ${selectedItems.length} selected tenants will be ${action}.`;
    } else {
        message = `All found tenants will be ${action}`;
    }

    return containerContext.confirm({
        title: title === UnlockTitle
            ? 'Unlock confirmation'
            : (
                title === LockTitle
                    ? 'Lock confirmation'
                    : 'Lock switching confirmation'
            ),
        message
    }).pipe(
        switchMap(ok => {
            if (ok) {
                return API.get('setup', 'data_type', dataType.id, 'digest', 'switch', {
                    headers: {
                        'X-Digest-Options': JSON.stringify({ selector })
                    }
                });
            }
            return of(false);
        })
    );
}

function SwitchLockIcon() {
    const [containerState] = useContainerContext();

    const title = contextTitle(containerState);

    if (title === UnlockTitle) {
        return <UnlockIcon/>;
    }

    if (title === LockTitle) {
        return <LockIcon/>;
    }

    return <SwitchIcon/>;
}

export default ActionRegistry.register(SwitchTenantLock, {
    key: 'switch_tenant_lock',
    kind: ActionKind.member,
    arity: 1,
    icon: SwitchLockIcon,
    title: contextTitle,
    executable: true,
    onlyFor: [TenantTypeSelector]
});
