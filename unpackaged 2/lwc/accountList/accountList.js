// accountList.js
import { LightningElement, wire } from 'lwc';
import getAccountList from '@salesforce/apex/AccountControllerList.getAccountList';

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
    { label: 'Employees', fieldName: 'Employees', type: 'number' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' }
];

export default class AccountList extends LightningElement {
  accounts;
    columns = columns;
    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
        } else if (error) {
            console.error('Error retrieving account list:', error);
        }
    }
}