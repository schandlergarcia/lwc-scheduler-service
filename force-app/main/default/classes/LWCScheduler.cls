global with sharing class LWCScheduler implements Schedulable, Database.AllowsCallouts {
  global void execute(SchedulableContext context) {
    if (!Test.isRunningTest()) {
      LWCSchedulerDemo.createAccountRecord();
    }
  }
}
