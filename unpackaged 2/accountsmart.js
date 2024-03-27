import { LightningElement, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import getAccountList from '@salesforce/apex/AccountControllerList.getAccountList';
import retrieveAccounts from '@salesforce/apex/AccountControllerList.retrieveAccounts';
import exportData from '@salesforce/apex/AccountControllerList.exportData';
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
    { label: 'Employees', fieldName: 'Employees', type: 'number' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' }
];
export default class ExportDataLWC extends LightningElement {
@track data;
    @track error;
    @track columns = columns;
    @track searchString;
    @track initialRecords;
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
    handleExport() {
        exportData()
            .then(result => {
                this.downloadCSV(result);
            })
            .catch(error => {
                console.error('Error exporting data: ', error);
                this.showToast('Error', 'An error occurred while exporting data.', 'error');
            });
    }
   downloadCSV(csvData) {
        const element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvData);
        element.download = 'exportedData.csv';
        document.body.appendChild(element);
        element.click();
    }
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
