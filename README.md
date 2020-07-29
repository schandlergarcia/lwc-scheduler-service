# LWC Scheduler Service

Recently, I was building a Salesforce Labs App that required me to enable a user to schedule an Apex job from the UI. I quickly realized I didn't know enough about the process and found a lack of information about the topic. I've written a basic overview of how to manage scheduled jobs from the UI and give your apps a bit more setup capability.

## Features

The app demonstrates:

- Array Destructuring
- Template Literals
- Scheduling Apex Jobs
- Aborting Scheduled Jobs
- Checking Schedule Job Status

## Installing LWC Scheduler Service using a Scratch Org

1. If you haven't already done so, authorize your hub org and provide it with an alias (**myhuborg** in the command below):

   ```
   sfdx force:auth:web:login -d -a myhuborg
   ```

1. Clone the repository:

   ```
   git clone https://github.com/schandlergarcia/lwc-scheduler-service
   cd lwc-scheduler-service
   ```

1. Create a scratch org and provide it with an alias (**lwc-scheduler** in the command below):

   ```
   sfdx force:org:create -s -f config/project-scratch-def.json -a lwc-scheduler
   ```

1. Push the app to your scratch org:

   ```
   sfdx force:source:push
   ```

1. Open the scratch org:

   ```
   sfdx force:org:open
   ```

1. Create a remote site setting

Navigate to Setup > Remote Site Settings > Add a remote site setting for your community url
