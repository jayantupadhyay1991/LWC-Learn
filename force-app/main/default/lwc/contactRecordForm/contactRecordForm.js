import { LightningElement, track, wire } from 'lwc';
import getAllContacts from '@salesforce/apex/ContactManager.getContacts';
import delSelectedCons from '@salesforce/apex/ContactManager.deleteContacts';

// importing to refresh the apex after delete the records.
import {refreshApex} from '@salesforce/apex';

export default class ContactRecordForm extends LightningElement {
    @track data;
    numberOfRecords;

    numberOfContactChangeHandler(event){
        this.numberOfRecords = event.target.value;
    }

    getContacts(){
        getAllContacts({numberOfRecords:'$numberOfRecords'}).then(response =>{
            /*this.refreshTable = response;
        if (response.data) {
            this.data = response.data;
            this.error = undefined;

        } else if (response.error) {
            this.error = response.error;
            this.data = undefined;
        }
        }).catch(error =>{
            window.console.error('Error in getting the accounts', error.body.message);
        })*/
        this.data = response;})
    }

    @wire(getAllContacts, {numberOfRecords:'$numberOfRecords'})
    contacts(result) {
        this.refreshTable = result;
        if (result.data) {
            this.data = result.data;
            this.error = undefined;

        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }

    @track
    contactsToBeDeleted = [];

    newArray = [];
    conIds = new Set();
    refreshTable;

    get responseReceived(){
        if(this.contacts){
            //window.console.log('data ==> '+JSON.stringify(contacts));
            return true;
        }
        return false;
    }
    
    deleteSelectedContact(){
       // var toBeDleted = [];
       window.console.log(this.newArray.length);
       delSelectedCons({lstConIds: this.newArray})
        .then(result => {
            window.console.log('result ====> ' + result);

            //this.buttonLabel = 'Delete Selected Contacts';
            //this.isTrue = false;

            // showing success message
            /*this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!', 
                    message: this.recordsCount + ' Contacts are deleted.', 
                    variant: 'success'
                }),
            );*/
            
            // Clearing selected row indexs 
            //this.template.querySelector('lightning-datatable').selectedRows = [];

            //this.recordsCount = 0;

            // refreshing table data using refresh apex
            return refreshApex(this.refreshTable);

        })
        .catch(error => {
            window.console.log(error);
            /*this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while getting Contacts', 
                    message: error.message, 
                    variant: 'error'
                }),
            );*/
        });


    }
    handleChange(event){
        
        //window.console.log('I am clicked******');
        
        let temp = event.target.checked;
        let x = event.target.value;
        window.console.log('temp= '+temp);
        window.console.log("x= "+x);
        //window.console.log('I am clicked1');

        //--
        //let conIds_1 = new Set();
        if(temp){
        window.console.log("you have selected"+event.target.value);
        //conIds_1.push(temp);
        //window.console.log("conIds_1"+conIds_1);
        
        //this.newArray = this.newArray.push(x);
            //this.newArray.add(event.target.value);


    // getting selected record id
    
        this.conIds.add(x);
    

    // coverting to array
     

    //window.console.log('newArray ====> ' +this.newArray.length);
    }else{
        
        this.conIds.delete(x);

    }
    this.newArray = Array.from(this.conIds);
    // this set elements the duplicates if any
    
    }
}