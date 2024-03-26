import { LightningElement, wire, track } from 'lwc';
import retrieveAccounts from '@salesforce/apex/AccountControllerList.retrieveAccounts';
 
const columns = [
    { label: 'Name', fieldName: 'Name' },
     { label: 'Account Number', fieldName: 'AccountNumber' },
    { label: 'Employees', fieldName: 'Employees' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue' }
];
 
export default class LWCFilterSearchDatatable extends LightningElement {
    @track data;
    @track error;
    @track columns = columns;
    @track searchString;
    @track initialRecords;
 
    @wire(retrieveAccounts)
    wiredAccount({ error, data }) {
        if (data) {
            console.log(data);
            this.data = data;
            this.initialRecords = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }
 handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
 
        if (searchKey) {
            this.data = this.initialRecords;
 
            if (this.data) {
                let searchRecords = [];
 
                for (let record of this.data) {
                    let valuesArray = Object.values(record);
 
                    for (let val of valuesArray) {
                        console.log('val is ' + val);
                        let strVal = String(val);
 
                        if (strVal) {
 
                            if (strVal.toLowerCase().includes(searchKey)) {
                                searchRecords.push(record);
                                break;
                            }
                        }
                    }
                }
 
                console.log('Matched Accounts are ' + JSON.stringify(searchRecords));
                this.data = searchRecords;
                }
        } else {
            this.data = this.initialRecords;
        }
    }
}