// filterComponent.js
import { LightningElement, track, wire,api } from 'lwc';

export default class FilterComponent extends LightningElement {
    @api columns=[];
    @track filters = [{
        key: 0,
        field: '',
        operator: '',
        value: ''
    }];
    connectedCallback() {
        console.log('columns'+this.columns);
    }
    operatorOptions = [
        { label: 'Equals', value: 'equals' },
        { label: 'Contains', value: 'contains' },
    ];
  get comboboxOptions() {
        return this.columns.map(column => ({
            label: column.label,
            value: column.fieldName
        }));
    }


    addFilterRow() {
        const key = this.filters.length;
        this.filters.push({
            key: key,
            field: '',
            operator: '',
            value: ''
        });
    }

    removeFilterRow(event) {
        const index = event.target.dataset.index;
        this.filters.splice(index, 1);
        this.filters = [...this.filters];
    }

    handleFieldChange(event) {
        const index = event.target.dataset.index;
        this.filters[index].field = event.target.value;
    }

    handleOperatorChange(event) {
        const index = event.target.dataset.index;
        this.filters[index].operator = event.target.value;
    }

    handleValueChange(event) {
        const index = event.target.dataset.index;
        this.filters[index].value = event.target.value;
    }

    applyFilters() {
        this.dispatchEvent(new CustomEvent('filterchange', {
            detail: { filters: this.filters }
        }));
    }
}