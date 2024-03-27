public class AccountControllerList {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [SELECT Name,AccountNumber,NumberOfEmployees,AnnualRevenue,Industry,Type,Rating FROM Account];          
    }
   @AuraEnabled(cacheable = true)
    public static List<Account> fetchRecords() {
        return [SELECT Name, Phone, Industry From Account];
    }
     @AuraEnabled (cacheable=true)
    public static List<Account> retrieveAccounts(){
        return [SELECT Name,AccountNumber,NumberOfEmployees,AnnualRevenue,Industry,Type,Rating FROM Account]; 
    }
     @AuraEnabled(cacheable=true)
    public static RecordData getCountAndLastUpdated() {
        Integer count = [SELECT COUNT() FROM Account]; // Change YourObject to your object's API name
        DateTime lastUpdated = [SELECT LastModifiedDate FROM Account ORDER BY LastModifiedDate DESC LIMIT 1].LastModifiedDate;
        RecordData result = new RecordData();
        result.recordCount = count;
        result.lastUpdated = lastUpdated;
        return result;
    }

    public class RecordData {
        @AuraEnabled
        public Integer recordCount { get; set; }
        @AuraEnabled
        public DateTime lastUpdated { get; set; }
    }
}
