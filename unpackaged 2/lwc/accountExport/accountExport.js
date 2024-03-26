import { LightningElement, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import getAccountList from '@salesforce/apex/AccountControllerList.getAccountList';
import exportData from '@salesforce/apex/AccountControllerList.exportData';
const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
    { label: 'Employees', fieldName: 'Employees', type: 'number' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' }
];

export default class ExportDataLWC extends LightningElement {
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
}