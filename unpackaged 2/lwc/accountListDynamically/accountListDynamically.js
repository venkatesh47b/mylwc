// accountList.js
import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountControllerList.getAccountList';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
    { label: 'Employees', fieldName: 'Employees', type: 'number' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    { label: 'Rating', fieldName: 'Rating', type: 'text' }
];

const columnOptions = [
    { label: 'Industry', value: 'Industry' },
    { label: 'Type', value: 'Type' },
    { label: 'Rating', value: 'Rating' }
];

export default class AccountList extends LightningElement {
    accounts;
    columns = columns;
    columnOptions = columnOptions;
    selectedColumns = [];

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error retrieving account list:', error);
        }
    }

    get visibleColumns() {
        return this.columns.filter(col => this.selectedColumns.includes(col.fieldName));
    }

    handleColumnChange(event) {
        this.selectedColumns = event.detail.value;
    }
}