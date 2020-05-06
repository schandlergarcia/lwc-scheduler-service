import { LightningElement, track } from 'lwc';
import getCurrentlyScheduledCron from '@salesforce/apex/LWCSchedulingService.getCurrentlyScheduleCron';
import runFirstJob from '@salesforce/apex/LWCSchedulingService.runFirstJob';
import checkFirstJobStatus from '@salesforce/apex/LWCSchedulingService.checkFirstJobStatus';
import scheduleJob from '@salesforce/apex/LWCSchedulingService.scheduleJob';
import deleteScheduledJob from '@salesforce/apex/LWCSchedulingService.deleteScheduledJob';

export default class LwcScheduler extends LightningElement {

    cronJobName = 'Create Daily Account Record';
    methodName = 'createAccountRecord';
    @track currentCronAsTime;
    currentCronAsString;
    state; // test, schedule, reschedule
    loading;

    connectedCallback(){

        this.loading = true;
        this.getScheduledCron();
    }

    /**
     * On component load - we want to check to see if the job is currently scheduled. If it is
     * scheduled - we can modify the state appropriatley.
     */

    getScheduledCron() {
        getCurrentlyScheduledCron({cronJobName : this.cronJobName}).then(result => {
            switch(result){
                case 'test':
                this.state = result;
                break;
                case 'schedule':
                this.state = result;
                break;
                default:
                this.currentCronAsTime = this.convertCronToTime(result);
                console.log('Job Scheduled for: ' + this.currentCronAsTime);
                this.state = 'reschedule';
            }
            this.stopLoading(100);
        }).catch(error => {

            this.stopLoading(100);

        })
    }

    convertCronToTime(result){
        let cronArray = result.split(' ');
        let [second, minute, hour] = cronArray;
        return `${hour}:${minute}:00.000`;
    }

    runFirstJob() {
        runFirstJob({}).then(data => {
            this.checkFirstSecurityJobStatus();
        }).catch(error => {
            this.stopLoading(100);
        })
    }

    checkFirstJobStatus() {
        checkFirstJobStatus({submittedDatetime: this.dateTimeSubmitted, methodName: this.methodName}).then(result => {
            switch(result){
                case 'Completed':
                    this.state = 'schedule';
                    this.stopLoading;
                    break;
                case 'Aborted', 'Failed':
                    this.stopLoading(500);
                    console.log(data.ExtendedStatus);
                default:
                    setTimeout(() => {
                        (console.log('Checking'));
                        this.checkFirstJobStatus();
                    }, 100);
                }
            }).catch(error => {
            console.log(error.message);
        })
    }

    scheduleApexJob() {
        scheduleJob({cronString: this.currentCronAsString, cronJobName: this.cronJobName}).then(data => {

            console.log(data);

            if (data) {
                this.state = 'reschedule';
                this.getScheduledCron();
            } else {
                this.stopLoading(100);
                console.log('Unable to Schedule Job');
            }

        }).catch(error => {
            this.stopLoading(100);
            console.log(error.message);
        })
    }

    deleteJob() {
        deleteScheduledJob({cronJobName: this.cronJobName}).then(data => {

            console.log(data);

            if (data) {
                this.state = 'schedule';
                this.currentCronAsTime = '';
                this.stopLoading(100);
                console.log('Job Deleted');

            } else {
                this.stopLoading(100);
                console.log('we were unable to delete this job');
            }

        }).catch(error => {
            this.stopLoading(100);
            console.log(error.message);
        })
    }

    handleTimeChange(event){

        let time = event.target.value;
        let [hour, minute, seconds] = time.split(':');
        this.currentCronAsString = `0 ${minute} ${hour} ? * * *`;

    }
    /**
     * The stopLoading utility is used to control a consistant state experience for the user - it ensures that 
     * we don't have a flickering spinner effect when the state is in flux.
     * @param {timeoutValue} timeoutValue
     */

    stopLoading(timeoutValue) {
        setTimeout(() => {
            this.loading = false;
        }, timeoutValue);

    }





}