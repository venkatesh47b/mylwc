import { LightningElement, wire ,track} from 'lwc';
import fetchData from '@salesforce/apex/lwcDynamicTask.getAccountdata';

 const columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Account Number', fieldName: 'AccountNumber' },
        { label: 'Billing Address', fieldName: 'BillingAddress' },
        { label: 'Description', fieldName: 'Description' }
    ];
export default class AccountList extends LightningElement {
    showPopup = false;
  @track isShowFilter=false;
  displayField=false;
    accounts;
    selectedFields = [];
    selectedColumns=[];
     availableFields = [
        { label: 'Industry', fieldName: 'Industry',value: 'Industry' },
        { label: 'Type', fieldName: 'Type',value: 'Type' },
        { label: 'Rating', fieldName: 'Rating',value: 'Rating' }
    ];
        initialRecords;
    selectedAccounts = [];
   
     connectedCallback() {
        this.selectedColumns =columns;
        
    }
    get displayedColumns() {
    return this.selectedColumns.map(col => {
        return { label: col.label, fieldName: col.fieldName,type: 'text' };
    });
}

 @track isShowModal = false;

    showFilterBox() {  
        this.isShowFilter = true;
    }
    hideFilterBox() {  
        this.isShowFilter = false;
    }
    hideModalBox() {  
        this.isShowModal = false;
    }
    handleFieldSelection(event) {
        this.displayField=true;
        this.selectedFields=event.detail.value;
    const selectedValue = event.detail.value;
    const selectedColumn = this.availableFields.find(field => field.value === selectedValue);
    
    if (selectedColumn) {
        const existingColumn = this.selectedColumns.find(col => col.value === selectedValue);
        if (!existingColumn) {
            this.selectedColumns = [...this.selectedColumns, selectedColumn];
        }
    }
}


handleRemoveField(event) {
    const fieldToRemove = event.target.field; 
    console.log('fieldToRemove' + fieldToRemove);
    if (fieldToRemove) {
        this.selectedColumns = this.selectedColumns.filter(col => col.value !== fieldToRemove);
    }
}


    @wire(fetchData)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.initialRecords=data;
        } else if (error) {
            console.error('Error retrieving accounts:', error);
        }
    }
handleSearch(event) {
        const searchKey = event.target.value.toLowerCase();
        if (searchKey) {
            this.accounts = this.initialRecords.filter(rec => {
                return rec.Name.toLowerCase().includes(searchKey);
            });
        } else {
            this.accounts = this.initialRecords;
        }
    }
    handleRowSelection(event) {
        this.selectedAccounts = event.detail.selectedRows;
    }

    sendSelectedAccounts() {
console.log('this.selectedAccounts:', JSON.stringify(this.selectedAccounts));
        if (this.selectedAccounts.length > 0) {
            const selectedAccountsArray = this.selectedAccounts.map(account => {
                return {
                    Id: account.Id,
                    Name: account.Name,
                    Email: account.Email,
                    Phone: account.Phone,
                     Type: account.Type,
                    Industry: account.Industry,
                    Rating: account.Rating
                };
            });

            const selectedAccountsEvent = new CustomEvent('sendaccounts', { detail: selectedAccountsArray });
            this.dispatchEvent(selectedAccountsEvent);
            this.showPopup = true;
        } else {
        }
                this.isShowModal = true;
    }
handleFilterChange(event) {
    const filters = event.detail.filters;

    this.accounts = this.initialRecords.filter(record => {
        let matchesFilters = true;
        filters.forEach(filter => {
            if (record.hasOwnProperty(filter.field)) {
                const fieldValue = record[filter.field];
                const filterValue = filter.value.toLowerCase();
                switch (filter.operator) {
                    case 'equals':
                        matchesFilters = matchesFilters && fieldValue.toLowerCase() === filterValue;
                        break;
                    case 'contains':
                        matchesFilters = matchesFilters && fieldValue.toLowerCase().includes(filterValue);
                        break;
                    default:
                        matchesFilters = false; 
                        break;
                }
            } else {
                matchesFilters = false; 
            }
        });
        return matchesFilters;
    });
    this.isShowFilter=false;
}
   handleDownload() {
        let selectedRows = [];
        let recordsToExcel = [];
        selectedRows = this.template.querySelector("lightning-datatable").getSelectedRows()
        if(selectedRows.length > 0) {
            recordsToExcel = [...selectedRows];
        } else {
            recordsToExcel = [...this.accountData];
        }
        let csvFile = this.updateCSV(recordsToExcel)
        this.createLinkForDownload(csvFile);
    }
    updateCSV(recordsToExcel) {
        let csvHeader = Object.keys(recordsToExcel[0]).toString() ;
        console.log('header: '+csvHeader);
        let csvBody = recordsToExcel.map((currItem) => Object.values(currItem).toString());
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
}