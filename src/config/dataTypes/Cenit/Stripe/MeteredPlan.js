import React from 'react';
import PlanIcon from "@material-ui/icons/RequestQuote";
import MenuIcon from "@material-ui/icons/RequestQuoteOutlined";

const fields = ['nickname', 'product', 'interval', 'currency', 'amount', 'summary', 'description'];

export const PlanMenuIcon = MenuIcon;

export default {
    title: 'Metered Plan',
    icon: <PlanIcon component="svg"/>,
    actions: {
        index: {
            fields: [...fields, 'updated_at']
        },
        new: {
            fields
        }
    },
    fields: {
        description: {
            controlProps: {
                multiline: true
            }
        }
    },
};
