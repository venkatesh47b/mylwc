import { LightningElement, wire, track } from 'lwc';
import retrieveAccounts from '@salesforce/apex/AccountControllerList.retrieveAccounts';
import fetchRecords from '@salesforce/apex/AccountControllerList.fetchRecords';
import getCountAndLastUpdated from '@salesforce/apex/AccountControllerList.getCountAndLastUpdated';
 
const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Account Number', fieldName: 'AccountNumber' },
    { label: 'Employees', fieldName: 'Employees' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue' }
]; 
export default class LWCFilterSearchDatatable extends LightningElement {
    recordCount;
    lastUpdated;
    @wire(getCountAndLastUpdated)
    wiredData({ error, data }) {
        if (data) {
            this.recordCount = data.recordCount;
            this.lastUpdated = data.lastUpdated;
        } else if (error) {
            console.error(error);
        }
    }
     accountData = [];
     @wire(fetchRecords) wiredFunction({data, error}) {
        if(data) {
            this.accountData = data;
    
        } else if(error) {
            console.log(error);
        }
    }
    get checkRecord() {
        return this.accountData.length > 0 ? false : true; 
    }
    clickHandler() {
        let selectedRows = [];
        let downloadRecords = [];
        selectedRows = this.template.querySelector("lightning-datatable").getSelectedRows()
        if(selectedRows.length > 0) {
            downloadRecords = [...selectedRows];
        } else {
            downloadRecords = [...this.accountData];
        }
        let csvFile = this.convertArrayToCsv(downloadRecords)
        this.createLinkForDownload(csvFile);
    }
    convertArrayToCsv(downloadRecords) {
        let csvHeader = Object.keys(downloadRecords[0]).toString() ;
        console.log('header: '+csvHeader);
        let csvBody = downloadRecords.map((currItem) => Object.values(currItem).toString());
        console.log('body: '+csvBody);
        let csvFile = csvHeader + "\n" + csvBody.join("\n");
        return csvFile;
    }
    createLinkForDownload(csvFile) {
        const downLink = document.createElement("a");
        downLink.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
        downLink.target = '_blank';
        downLink.download = "Account_Record_Data.csv"
        downLink.click();
    }
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
