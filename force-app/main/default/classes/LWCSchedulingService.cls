public with sharing class LWCSchedulingService {
  /**
   * The setup utilities are used to manage scheduled jobs throughout the app. With these you can see the details
   * of a schedule job, schedule a job, or delete a scheduled job.
   */
  @AuraEnabled
  public static void runFirstJob() {
    LWCSchedulerDemo.createAccountRecord();
  }

  @AuraEnabled
  public static Datetime getCurrentDateTime() {
    return Datetime.now();
  }

  @AuraEnabled
  public static AsyncApexJob checkFirstJobStatus(
    Datetime submittedDatetime,
    String methodName
  ) {
    List<AsyncApexJob> asyncApexJobs = [
      SELECT Id, Status, ExtendedStatus
      FROM AsyncApexJob
      WHERE MethodName = :methodName AND CompletedDate >= :submittedDatetime
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];
    AsyncApexJob asyncApexJob = (asyncApexJobs.size() == 1)
      ? asyncApexJobs.get(0)
      : null;
    if (asyncApexJob != null) {
      return asyncApexJob;
    }
    return null;
  }

  @AuraEnabled
  public static String getCurrentlyScheduleCron(String cronJobName) {
    List<CronTrigger> cronTriggers = [
      SELECT Id, CronExpression
      FROM CronTrigger
      WHERE CronJobDetail.Name = :cronJobName
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];
    CronTrigger cronTrigger = (cronTriggers.size() == 1)
      ? cronTriggers.get(0)
      : null;

    if (cronTrigger != null) {
      return cronTrigger.CronExpression;
    }

    return null;
  }

  @AuraEnabled
  public static Boolean scheduleJob(String cronString, String cronJobName) {
    try {
      LWCScheduler scheduler = new LWCScheduler();
      System.schedule(cronJobName, cronString, scheduler);
      return true;
    } catch (Exception e) {
      System.debug(e.getMessage());
      return false;
    }
  }

  @AuraEnabled
  public static Boolean deleteScheduledJob(String cronJobName) {
    try {
      List<CronTrigger> cronTriggers = [
        SELECT Id, CronExpression
        FROM CronTrigger
        WHERE CronJobDetail.Name = :cronJobName
        WITH SECURITY_ENFORCED
        LIMIT 1
      ];
      CronTrigger cronTrigger = (cronTriggers.size() == 1)
        ? cronTriggers.get(0)
        : null;
      System.abortJob(cronTrigger.Id);
      return true;
    } catch (Exception e) {
      System.debug(e.getMessage());
      return false;
    }
  }
}
