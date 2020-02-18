public with sharing class ContactManager {

    @AuraEnabled(cacheable=true)
    public static List<WrapContact> getContacts(Integer numberOfRecords){
        if(numberOfRecords==null || String.isBlank(String.valueOf(numberOfRecords))){
            numberOfRecords = 10;
        }
        List<WrapContact> wrapContactList = new List<WrapContact>();
        for(Contact c : [SELECT Id, Name, Phone, Email from Contact Limit :numberOfRecords]){
            wrapContactList.add(new WrapContact(c));

        }
        return wrapContactList;
    }

    public with sharing class WrapContact {
        @AuraEnabled
        public Contact con;

        @AuraEnabled
        public boolean  selected;

        public WrapContact(Contact con) {
            this.con = con;
            this.selected = selected;
        }
    }

    @AuraEnabled
    public static void deleteContacts(list<Id> lstConIds){
        try {
            list<Contact> lstConsToDelete = new list<Contact>();
            System.debug('lstConIds ====> '+lstConIds);
            for(Id idCon : lstConIds) {
                lstConsToDelete.add(new Contact(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty()) {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
   

  }