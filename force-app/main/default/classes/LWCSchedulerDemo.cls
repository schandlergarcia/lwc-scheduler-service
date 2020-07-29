public with sharing class LWCSchedulerDemo {
  /**
   * createAccountRecord This method is used to demostrate that we can create and check the status of a job
   */
  @Future
  public static void createAccountRecord() {
    Account newAccount = new Account();
    newAccount.Name = 'Account ' + System.today();
  }
}
