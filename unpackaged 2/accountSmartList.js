import { LightningElement, wire } from 'lwc';
import retrieveAccounts from '@salesforce/apex/AccountControllerList.retrieveAccounts';
import fetchRecords from '@salesforce/apex/AccountControllerList.fetchRecords';
import getCountAndLastUpdated from '@salesforce/apex/AccountControllerList.getCountAndLastUpdated';
 
export default class AccountList extends LightningElement {
    // record count
    recordCount;
    lastUpdated;
    @wire(getCountAndLastUpdated)
    wiredData({ error, data }) {
        if (data) {
            this.recordCount = data.recordCount;
            this.lastUpdate = new Date().toLocaleString();
        } else if (error) {
            console.error(error);
        }
    }
    // Export
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
    // dynamic list 
    accounts = [];
    columnsHeader = ['Name', 'AccountNumber', 'NumberOfEmployees', 'AnnualRevenue', 'Industry', 'Type', 'Rating'];
    filteredAccounts = [];
    selectedColumns = [];
    columnOptions = [
        { label: 'Industry', value: 'Industry' },
        { label: 'Type', value: 'Type' },
        { label: 'Rating', value: 'Rating' }
    ];
    searchText = '';
 
    connectedCallback() {
        this.selectedColumns = ['Name', 'AccountNumber', 'NumberOfEmployees', 'AnnualRevenue'];
    }
 
    get displayedColumns() {
        return this.selectedColumns.map(col => {
            return { label: col, fieldName: col, type: 'text' };
        });
    }
    @wire(retrieveAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.applySearchFilter();
        } else if (error) {
            console.error(error);
        }
    }
    handleColumnChange(event) {
        const selectedValue = event.detail.value;
        if (selectedValue && !this.selectedColumns.includes(selectedValue)) {
            this.selectedColumns = [...this.selectedColumns, selectedValue];
        } else {
            this.selectedColumns = this.selectedColumns.filter(col => col !== selectedValue);
        }
    }
    handleSearchChange(event) {
        this.searchText = event.target.value;
        this.applySearchFilter();
    }
    applySearchFilter() {
        if (this.searchText) {
            const searchRegex = new RegExp(this.searchText, 'i');
            this.filteredAccounts = this.accounts.filter(account => searchRegex.test(account.Name));
        } else {
            this.filteredAccounts = [...this.accounts];
        }
    }
}
