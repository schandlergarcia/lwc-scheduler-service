import { LightningElement } from 'lwc';
import getCurrentlyScheduledCron from '@salesforce/apex/LWCSchedulingService.getCurrentlyScheduleCron';
import runFirstJob from '@salesforce/apex/LWCSchedulingService.runFirstJob';
import checkFirstJobStatus from '@salesforce/apex/LWCSchedulingService.checkFirstJobStatus';
import scheduleJob from '@salesforce/apex/LWCSchedulingService.scheduleJob';
import deleteScheduledJob from '@salesforce/apex/LWCSchedulingService.deleteScheduledJob';

export default class LwcScheduler extends LightningElement {

    cronJobName = 'Create Daily Account Record';
    methodName = 'createAccountRecord';
    currentCronAsTime;
    state; // test, schedule, reschedule
    loading;

    connectedCallback(){

        loading = true;

    }

    /**
     * On component load - we want to check to see if the job is currently scheduled. If it is
     * scheduled - we can modify the state appropriatley.
     */

    getCurrentlyScheduledCron() {
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
                this.state = 'reschedule';
            }
            this.stopLoading(100);
        }).catch(error => {

            this.stopLoading(100);
            this.showUIMessage('Error', error.message, 'error', 'utility:error', 'inverse');

        })
    }

    convertCronToTime(result){
        let cronArray = result.split(' ');
        [hour, minute, second] = cronArray;
        return '${hour}:${minute}:${second}.000';

    }

    runFirstJob() {
        runFirstJob({}).then(data => {
            this.checkFirstSecurityJobStatus();
        }).catch(error => {
            this.stopLoading(100);
        })
    }

    checkFirstJobStatus() {
        //this.hideUIMessage();
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

    scheduleJob() {
        scheduleJob({cronString: this.currentCron, cronJobName: this.cronJobName}).then(data => {

            console.log(data);

            if (data) {
                this.state = 'reschedule';
                this.getCurrentlyScheduledCron();
            } else {
                this.stopLoading(100);
                console.log('Unable to Schedule Job');
            }

        }).catch(error => {
            this.stopLoading(100);
            console.log(error.message);
        })
    }

    deleteScheduledJob() {
        deleteScheduledJob({}).then(data => {

            console.log(data);

            if (data) {
                this.state = 'schedule';
                this.currentCronAsTime;
                this.stopLoading(100);

            } else {
                this.stopLoading(100);
                console.log('we were unable to schedule this sync');
            }

        }).catch(error => {
            this.stopLoading(100);
            console.log(error.message);
        })
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