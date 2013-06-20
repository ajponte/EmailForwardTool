// Email Fowarding WebApp 1.5
// Created by Karlina Beringer. January 18, 2013.
// Updated by Julie Petersen and Karlina Beringer. January 25, 2013
// Updated by Alan Ponte June 6, 2013
// Description: A stand-alone webapp that forwards emails from the user's inbox
//             to one or multiple recipients. Users have three options:
//                1. Send emails one time now.
//                2. Send emails automatically once a day.
//                3. Stop sending emails automatically once a day.
//             This app allows the user to quickly forward large quantities of 
//             emails at once instead of having to forward them one-by-one.
//-------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------
// Displays a webpage interface with information about this app and an inputForm for
// entering and submitting the followin data to the sever:
//      Text Fields:
//       - recipient(s): the email address(es) to forward mail to.
//       - startLabel: identifies messages in the user's inbox to be forwarded.
//       - endLabel: identifies messages that have been forwarded via this webapp.
//       - subjectPrefix: an optional parameter to add to the subject line of messages
//                        so that the recipients can easily identify them.
//      Buttons:
//       - sendNow: a submit button that triggers a form submit (the doPost operation)
//       - sendDaily: a button that sets forwardEmails to run for this user daily
//       - stopSendDaily: a button that removes the time-based trigger for sendDaily.           
//-------------------------------------------------------------------------------------

function doGet() {
  var imageLink = "http://cso.lbl.gov/assets/img/L2/Download_Logo-B.png";
  var userName = Session.getActiveUser().getUserLoginId();
  var app = UiApp.createApplication();
  app.setTitle("Email Forwarding Tool");
  // Add the LBL logo to the UI.
  var image = app.createImage(imageLink).setSize(425, 90)
                 .setStyleAttribute("paddingLeft", 50)
                 .setStyleAttribute("paddingTop", 25);
  app.add(image);
  
  // Add a message displaying the active user's login id.
  var loggedInAs = app.createLabel("You are logged in as " + userName)
                      .setStyleAttribute("fontWeight", "bold")
                      .setStyleAttribute("paddingLeft", 50)
                      .setStyleAttribute("paddingTop", 25);
  app.add(loggedInAs);
  
  // Add a panel containg instructions and app info.
   var instructionsPanel = app.createAbsolutePanel().setWidth('600').setId('instructionsPanel')
                             // .setSize(600, 450)
                              .setStyleAttribute("paddingLeft", 50);
   instructionsPanel.add(app.createHTML(
        '<p><h2 style="color:navy"> Email Forwarding Tool</h2></p>' +
     
        '<p><h4> Hi! This tool lets you forward email messages to other email accounts. ' +
         'This is especially useful for sending a large volume of emails. Instead of going ' +
         'through your inbox and forwarding emails one-by-one, you can now assign a label ' +
         'to the emails you wish to forward and send them with just a few clicks! </h4></p>' +
        
        '<b><i><p><h4 style="color:navy"> In your inbox: </h4></p></i></b>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '1) <b>CREATE START LABEL</b>: In your Gmail account, create a label ' +
        '(e.g."To Forward" or nested label would be written as "ParentName/To Forward") ' +
        'to place emails that you want to forward. </p>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '2) <b>CREATE END LABEL</b>: Create a second label (e.g. "Forwarded") to mark ' +
        'emails that have been forwarded. Emails will be moved into this label when ' +
        'forwarded.</p>' +
        
        '<b><i><p><h4 style="color:navy"> In this Tool: </h4></p></i></b>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '3) <b>RECIPIENTS</b>: In the form below, enter the email address(es) to ' +
        'forward your messages to. Separate multiple addresses with a comma.</p>'  +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '4) <b>START LABEL</b>: Enter the label where emails have been placed ' +
        'in preparation for forwarding. </p>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '5) <b>END LABEL</b>: Enter the label where emails are placed ' +
        'after forwarding. </p>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '6) <b>SUBJECT PREFIX</b>: (Optional) Enter a "prefix" to append to ' +
        'the front of forwarded subject lines. This will make identifying ' +
        'forwarded emails easier. </p>' +
        
        '<p style="font-family:verdana;font-size:12px;"> ' +
        '7) <b>BUTTONS</b>: To forward your emails one time right now, click the "Send Now" ' +
        'button at the bottom of this page. If you want to start forwarding emails from ' +
        'your start label on a daily basis, click the "Send Daily" button (this will run at ' +
        'approximately 1:00 am). If you want to stop forwarding your emails automatically, ' +
        'click the "Stop Sending ' +
        'Daily" button.</p>' +
         
     '<p style style="font-family:verdana;font-size:14px;">' + '<b> NOTE:  It may take up to 10 minutes for all '+
      'meessages to forward after the script is finished running. </b> </p>' + 
     '<p style style="font-family:verdana;font-size:14px;">' + '<b> For best results, label emails in batches (i.e. 50 emails at a time)'+
     '</b> </p>' + '<p style = "font-family:verdana;font-size:20px"  > </B>  IT IS RECOMMENDED TO SEND A SINGLE TEST EMAIL FIRST!!! </B><p>'
         
   ));
  app.add(instructionsPanel);
  
  // Create a grid for placing text fields and labels. 
  var grid = app.createGrid(6,5);
  
  var recipients = "";
  var start_label = "";
  var end_label = "";
  var subject_prefix = "";
  
  // Get the User Properties if they exist to "autofill" fields with.
  if (UserProperties.getProperty("E_F_T_recipients")) 
    recipients = UserProperties.getProperty("E_F_T_recipients");
  if (UserProperties.getProperty("E_F_T_start label")) 
    start_label = UserProperties.getProperty("E_F_T_start label");
  if (UserProperties.getProperty("E_F_T_end label"))
    end_label = UserProperties.getProperty("E_F_T_end label");
  if (UserProperties.getProperty("E_F_T_subject prefix")) 
    subject_prefix = UserProperties.getProperty("E_F_T_subject prefix");
  
  // Place labels and text fields into the grid.  
  grid.setWidget(1, 0, app.createLabel('Recipients:'));
  grid.setWidget(1, 1, app.createTextBox()
                         .setName("recipientBox")
                         .setId("recipientBox").setWidth(350)                 
                 .setStyleAttribute('backgroundColor', 'yellow')
                 .setText(recipients));
  
  grid.setWidget(2, 0, app.createLabel('Start Label:'));
  grid.setWidget(2, 1, app.createTextBox()
                          .setName("startBox")
                          .setId("startBox").setWidth(250)                 
                 .setStyleAttribute('backgroundColor', 'yellow')
                 .setText(start_label));
  
  grid.setWidget(3, 0, app.createLabel('End Label:'));
  grid.setWidget(3, 1, app.createTextBox()
                          .setName("endBox")
                          .setId("endBox").setWidth(250)                 
                 .setStyleAttribute('backgroundColor', 'yellow')
                 .setText(end_label));
  
  grid.setWidget(4, 0, app.createLabel('Subject Prefix:'));
  grid.setWidget(4, 1, app.createTextBox()
                          .setName("subBox")
                          .setId("subBox").setWidth(150)                 
                 .setStyleAttribute('backgroundColor', 'yellow')
                 .setText(subject_prefix));
  var helpAnchor = app.createAnchor("Need Help?", "https://commons.lbl.gov/display/appscripts/Email+Forwarding+Tool+Help")
  .setTitle("Get help with this tool");
  grid.setWidget(0, 3, helpAnchor);
  var formLink = "https://docs.google.com/a/lbl.gov/forms/d/1K-Y3aTIVxXL-GixYTSYoQhahziqiGzZVxMJw_ClnKrs/viewform";
  var formAnchor = app.createAnchor("Questions/Comments?", formLink).setTitle('Tell us what you think!');
  grid.setWidget(1, 3, formAnchor);
  // Create a "Send Now" button to call forwardEmails without parameters.
  var sendNowButton = app.createSubmitButton("Send Now").setId('sendNow');  
  // Create a "Send Daily" button to create a trigger to call 
  // forwardEmails every day at 1am. 
  // The callback element, grid, will supply input to sendDaily
  var sendDaily = app.createServerHandler("sendDaily");
  sendDaily.addCallbackElement(grid);
  var sendDailyButton = app.createButton("Send Daily", sendDaily).setStyleName('gwt-SubmitButton');
                          
  
  // Create a "Stop Send Daily" button to remove the trigger created by
  // the user clicking "Send Daily" from a previous session.
  var stopSendDaily = app.createServerHandler("stopSendDaily");
  var stopSendDailyButton = app.createButton("Stop Sending Daily", stopSendDaily).setStyleName('gwt-SubmitButton');
  
  // Create a Form to submit
  var inputForm = app.createFormPanel().setStyleAttribute("paddingLeft", 50)
                                       //.setStyleAttribute("paddingTop", 25)
                                       .setId("inputForm");                      
  var flow = app.createFlowPanel().setId('flow');
  flow.add(grid);
  flow.add(sendNowButton);
  // Check to see if the "unique trigger id" user property exists
  var triggerExists = false;
  var myKeys = UserProperties.getKeys();
  for (var i = 0; i < myKeys.length; i++) {
    if (myKeys[i] == "E_F_T_unique trigger id") {
      triggerExists = true;
      break;
    }
  }
  //-----------------------------------------------------------------------
  //create a confirmation button for 'send now' user to confirm choice
  //----------------------------------------------------------------------
  var confirmButton = app.createButton('OK').setId('confirmButton').setSize("60px", "75x");
  var buttonHandler = app.createServerHandler('forwardHandler');
  var closeHandler = app.createServerHandler('closeHandler');
  confirmButton.addClickHandler(closeHandler);
  confirmButton.addClickHandler(buttonHandler);
  confirmButton.setEnabled(false);
  //----------------------------------------------------------------------
  //create confirmation button for 'send daily'
  //---------------------------------------------------------------------
  var send_Daily_Confirm_Button = app.createButton('OK').setId('sendDailyConfirmButton');
  var send_Daily_Confirm_Button_Handler = app.createServerHandler('sendDailyConfirmHandler');
  var send_Daily_Close_Handler = app.createServerHandler('sendDailyCloseHandler');
  send_Daily_Confirm_Button.addClickHandler(send_Daily_Close_Handler);
  send_Daily_Confirm_Button.addClickHandler(send_Daily_Confirm_Button_Handler);
  send_Daily_Confirm_Button.setEnabled(false).setVisible(false);
  
  if(triggerExists == false) flow.add(sendDailyButton);
  if(triggerExists == true) flow.add(stopSendDailyButton);
  flow.add(app.createSimplePanel().setHeight(100));
  inputForm.add(flow);
  app.add(inputForm);
  // Display the UI
  
  return app;  
}

//-------------------------------------------------------------------------------------
// The response to sendNow button clicks.
// doPost allows the inputForm to be handled as a submitButton event.
// doPost will call forwardEmails once without saving user data as properties or 
// creating/deleting any triggers.
// Returns a results webpage showing whether the user data was recieved or not.
//-------------------------------------------------------------------------------------

function doPost(event) {
  var app = UiApp.getActiveApplication();
  var send = app.getElementById('sendNow');
  send.setVisible(false);
  // Extract values from the text fields of the inputForm.
  var recipients = event.parameter.recipientBox;
  var start_label = event.parameter.startBox;
  var end_label = event.parameter.endBox;
  var subject_prefix = event.parameter.subBox;

  
  // Remove leading or trailing spaces from the inputs.
  recipients = removeLeadingTrailingSpaces(recipients);
  Logger.log('the doPost ' + recipients);
  start_label = removeLeadingTrailingSpaces(start_label);
  end_label = removeLeadingTrailingSpaces(end_label);
  subject_prefix = removeLeadingTrailingSpaces(subject_prefix);
  
  ScriptProperties.setProperty('forward_recipients', recipients);
  ScriptProperties.setProperty('forward_start_label', start_label);
  ScriptProperties.setProperty('forward_end_label', end_label);
  ScriptProperties.setProperty('forward_subject_prefix', subject_prefix);
  
  // Sanity Check: Checks for errors and displays the appropriate message to webpage.
  var emailError = app.createHTML('<p><h3 style="color:red"> Error: ' +
                   'Invalid Email format. Please reload this page (press F5) and try again.</h3></p>')
                      .setStyleAttribute("paddingLeft", 50)
                      .setStyleAttribute("paddingTop", 25);
  
  var startLabelError = app.createHTML('<p><h3 style="color:red"> ' +
                        'Error: The START label you entered, ' + 
                        start_label + ', does not exist. Please reload this page (press F5) and try again.' +
                        '</p></h3>')
                           .setStyleAttribute("paddingLeft", 50)
                           .setStyleAttribute("paddingTop", 25);
                           
  var endLabelError = app.createHTML('<p><h3 style="color:red"> ' +
                      'Error: The END label you entered, ' + 
                      end_label + ', does not exist. Please reload this page (press F5) and try again.' +
                      '</p></h3>')
                           .setStyleAttribute("paddingLeft", 50)
                           .setStyleAttribute("paddingTop", 25);

  var success =  '<p><h3 style="color:green">' +
                       'Forwarding is Complete! Check your start and end labels to confirm ' + '<b> A confirmation email will be sent to ' + Session.getActiveUser()
                       ' results. Reload this page (press F5) to forward more emails.'; //+ success_subj;
  var successMessage = app.createHTML(success).setStyleAttribute("paddingLeft", 50).setStyleAttribute("paddingTop", 25).setId('success');

  var errorFlag = false;
  var errorMessage = '<h3>The following errors occurred:</h3> <ol>';
  // Display the appropriate error message(s).
  if (!isValidEmailFormat(recipients)) {
    errorMessage += '<li>Recipient email is missing or the format is invalid.</li> '; +
                   'Invalid Email format. Please reload this page (press F5) and try again.</h3></p>';
    errorFlag = true;
  }
  if (!isValidLabel(start_label)) {
    if(!start_label || start_label == '') {
      errorMessage += '<li>You must enter a START label.</li> ';
    }
    else {
      errorMessage += '<li>The START label you entered, ' + start_label + ', does not exist.</li> ';
    }
    errorFlag = true;
  }
  if (!isValidLabel(end_label)) {
    if(!end_label || end_label == '') {
      errorMessage += '<li>You must enter an END label.</li> ';
    }
    else {
      errorMessage += '<li>The END label you entered, ' + end_label + ', does not exist.</li> ';
    }
    errorFlag = true;
  }
  if (!errorFlag) {
    // There are no errors, but the user needs to confirm the forward

      //CALL MAIN FUNCTION forwardEmails if there are no errors
    var panel = app.getElementById('instructionsPanel');
    panel.clear()
    
    var num_conversations = GmailApp.getUserLabelByName(start_label).getThreads().length;
    var confirmHTML = '<p></p> <p style = "font-size: 20px; color:green"><B>Are you sure? <B><p></p>' + num_conversations + ' conversations will be forwarded to ' 
    + recipients + " <p><\p> With start label: " + start_label + " <p></p> and end label: " + end_label + 
      " <p><\p> <B style = 'color:green; font-size:20px'> Click OK to continue....Refresh the page to cancel.</B></p>";
    
    panel.add(app.createHTML(confirmHTML));
    var confirmButton = app.getElementById('confirmButton');
    app.add(confirmButton);
    confirmButton.setEnabled(true);
      
  }

  else {
    errorMessage += '</ol><p>Please reload this page (press F5) and try again.</p> ';
    var errorHTML = app.createHTML(errorMessage).setStyleAttribute("paddingLeft", 50).setStyleAttribute("color", "red");
    app.add(errorHTML);
  
  }
  // Display the UI
  return app;
}
//----------------------------------------------------------------------------------------------------
//Handler to hide the confirmation button.  Sends message to user to wait for forwarded messages
//---------------------------------------------------------------------------------------------------
function closeHandler(event){
  var app = UiApp.getActiveApplication();
  var button = app.getElementById('confirmButton');
  button.setVisible(false);
  var panel = app.getElementById('instructionsPanel');
  panel.clear();
  var successHTML = '<p style = "margin-left: 38px; font-size: 20px"><B>Thank you!  Please wait for all messages to be forwarded</B></p>'+
    '<p style = "color : Blue; font-size : 20px"> You will receive a confirmation email when the process is complete.</p>';
  app.add(app.createHTML(successHTML)
           .setStyleAttribute("PaddingLeft", 50).setStyleAttribute("paddingTop", 50)).setStyleAttribute("color", "blue");
  return app;
}
//--------------------------------------------------------------------------------------------------------------
// Handler for confirmation button
// -----------------------------------------------------------------------------------------------------------
 function forwardHandler(event){
  var app = UiApp.getActiveApplication();
  var button = app.getElementById('confirmButton');
  button.setVisible(false);
  var panel = app.getElementById('instructionsPanel');
  panel.clear();
  var recipients = ScriptProperties.getProperty('forward_recipients');
  var start_label = ScriptProperties.getProperty('forward_start_label');
  var end_label = ScriptProperties.getProperty('forward_end_label');
  var subject_prefix = ScriptProperties.getProperty('forward_subject_prefix');
  //var successMsg = app.getElementById('success');
  forwardEmails(recipients, start_label, end_label, subject_prefix);
  //app.add(successMsg);
  ScriptProperties.deleteAllProperties();
  return app;
} 
//-------------------------------------------------------------------------------------
// The response to sendDaily button clicks.
// Preconditions: Takes user input from the grid in doGet (the textbox fields).
// Postconditions: Saves the user input (settings) as User Properties. Uses these
//                 settings as input for forwardEmails. 
// Calls createTrigger to turn on the "Send Daily" feature for the active user.
// Returns a results webpage showing the status of the trigger creation.
//-------------------------------------------------------------------------------------
function sendDaily(event) {
  var app = UiApp.getActiveApplication();
  
  // Hide the input form and buttons.
  app.getElementById("inputForm").clear();
  
  // Extract values from the text fields of the inputForm.
  var recipients = event.parameter.recipientBox;
  var start_label = event.parameter.startBox;
  var end_label = event.parameter.endBox;
  var subject_prefix = event.parameter.subBox;
  
  ScriptProperties.setProperty('recipients', recipients);
  ScriptProperties.setProperty('start_label', start_label);
  ScriptProperties.setProperty('end_label', end_label);
  ScriptProperties.setProperty('subject_prefix', subject_prefix);
  
  // Sanity Check: Checks for errors and displays the appropriate message to webpage.
  var emailError = app.createHTML('<p><h3 style="color:red"> Error: ' +
                   'Invalid Email format. Please refresh.</h3></p>')
                      .setStyleAttribute("paddingLeft", 50)
                      .setStyleAttribute("paddingTop", 25);
  
  var startLabelError = app.createHTML('<p><h3 style="color:red"> ' +
                        'Error: The START label you entered, ' + 
                        start_label + ', does not exist. Please refresh.' +
                        '</p></h3>')
                           .setStyleAttribute("paddingLeft", 50)
                           .setStyleAttribute("paddingTop", 25);
                           
  var endLabelError = app.createHTML('<p><h3 style="color:red"> ' +
                      'Error: The END label you entered, ' + 
                      end_label + ', does not exist. Please refresh.' +
                      '</p></h3>')
                           .setStyleAttribute("paddingLeft", 50)
                           .setStyleAttribute("paddingTop", 25);
  
  var successMessage = app.createHTML('<p><h3 style="color:green">' +
                       'The "Send Daily" feature has been turned on. Emails will be ' +
                       'forwarded every day at approximately 1:00 am according to your saved ' +
                       'settings: </h3></p> ' +
                       '<p><h3 style="color:green"> Messages in your start label, ' +
                       '"' + start_label + '", will be forwarded to the following ' +
                       'recipients: ' + recipients + '. After forwarding, the ' +
                       'messages will be placed in your end label, "' + end_label + 
                       '".</h3></p>' +
                       '<p><h3 style="color:green"> To turn off this feature, ' +
                       'reload this page (press F5) and click the "Stop Sending Daily" ' +
                       'button. </h3></p>');
                       
  var successMessagePanel = app.createSimplePanel()
                               .add(successMessage)
                               .setWidth(600)                      
                               .setStyleAttribute("paddingLeft", 50)
                               .setStyleAttribute("paddingTop", 25).setId('successMessagePanel');                     
  var errorFlag = false;
  var errorMessage = '<h3>The following errors occurred:</h3> <ol>';
  // Display the appropriate error message(s).
  if (!isValidEmailFormat(recipients)) {
    errorMessage += '<li>Recipient email is missing or the format is invalid.</li> '; +
                   'Invalid Email format. Please reload this page (press F5) and try again.</h3></p>';
    errorFlag = true;
  }
  if (!isValidLabel(start_label)) {
    if(!start_label || start_label == '') {
      errorMessage += '<li>You must enter a START label.</li> ';
    }
    else {
      errorMessage += '<li>The START label you entered, ' + start_label + ', does not exist.</li> ';
    }
    errorFlag = true;
  }
  if (!isValidLabel(end_label)) {
    if(!end_label || end_label == '') {
      errorMessage += '<li>You must enter an END label.</li> ';
    }
    else {
      errorMessage += '<li>The END label you entered, ' + end_label + ', does not exist.</li> ';
    }
    errorFlag = true;
  }
  // If the inputs are valid, then display a happy message and create a trigger.
  if (!errorFlag) {
        var panel = app.getElementById('instructionsPanel');
    panel.clear()
    
    var num_conversations = GmailApp.getUserLabelByName(start_label).getThreads().length;
    var confirmHTML = '<p></p> <p style = "font-size: 20px; color:green"><B>Are you sure? <B><p></p>' + num_conversations + ' conversations will be forwarded to ' 
    + recipients + " <p><\p> With start label: " + start_label + " <p></p> and end label: " + end_label + 
      " <p><\p> <B style = 'color:green; font-size:20px'> Click OK to continue....Refresh the page to cancel.</B></p>";
    app.add(app.createHTML(confirmHTML));
    var confirmButton = app.getElementById('sendDailyConfirmButton');
    app.add(confirmButton);
    confirmButton.setEnabled(true).setVisible(true);
    
  }
  else {
    errorMessage += '</ol><p>Please reload this page (press F5) and try again.</p> ';
    var errorHTML = app.createHTML(errorMessage).setStyleAttribute("paddingLeft", 50).setStyleAttribute("color", "red");
    app.add(errorHTML);
  
  }
  
  // Display the UI
  return app;
}
//-------------------------------------------------------------------------------------------------------------------
//Handler functions for when confirmation button selected for "send daily".  
//-------------------------------------------------------------------------------------------------------------------
function sendDailyCloseHandler(event){
  var app = UiApp.getActiveApplication();
  var successMessagePanel = app.getElementById('successMessagePanel');
  confirmButton = app.getElementById('sendDailyConfirmButton');
  confirmButton.setEnabled(false).setVisible(false);
  app.add(successMessagePanel);
  return app;
}
function sendDailyConfirmHandler(event){
  
  var recipients = ScriptProperties.getProperty('recipients');
  var start_label = ScriptProperties.getProperty('start_label');
  var end_label = ScriptProperties.getProperty('end_label');
  var subject_prefix = ScriptProperties.getProperty('subject_prefix');
  createTrigger(recipients, start_label, end_label, subject_prefix);
}

//-------------------------------------------------------------------------------------
// The response to sendStopSemdDaily button clicks.
// Calls deleteTrigger.
// Displays a result message to the webpage.
//-------------------------------------------------------------------------------------
function stopSendDaily(event) {
  var app = UiApp.getActiveApplication();
  
  // Hide the input form and buttons.
  app.getElementById("inputForm").clear();
  
  // Calls deleteTrigger
  var triggerDeleted = deleteTrigger();

  // Display an appropriate results message.
  var triggerDeleted = app.createHTML('<p><h3 style="color:green">' +
                   'The "Send Daily" feature has been turned off. </h3></p>')
                      .setStyleAttribute("paddingLeft", 50)
                      .setStyleAttribute("paddingTop", 25);                  
  app.add(triggerDeleted);
  
  // Display the webapp.
  return app;
}

//-------------------------------------------------------------------------------------
// Creates a time-based trigger to call automaticForwarding every day.
// Assumes that the parameters are being supplied by sendDaily.
// Preconditions: Takes in user settings as input.
// Postconditions: Saves the settings as user properties tied to the active user.
//                 Creates a time-based trigger to run on behalf of the active user.
//-------------------------------------------------------------------------------------
function createTrigger(recipients, start_label, end_label, subject_prefix) {
  // Remove existing triggers and properties associated with the active user.
  deleteTrigger();
  
  // Create a time-based trigger to call automaticForwarding every day.
  var trigger = ScriptApp.newTrigger("automaticForwarding").timeBased().everyDays(1).atHour(1).nearMinute(Math.floor(Math.random()*60)).create();
  //var trigger = ScriptApp.newTrigger("automaticForwarding").timeBased().everyMinutes(1).create();
  var trigger_id = trigger.getUniqueId();
  
  // Create User Properties.
  UserProperties.setProperty("E_F_T_recipients", recipients);
  UserProperties.setProperty("E_F_T_start label", start_label);
  UserProperties.setProperty("E_F_T_end label", end_label);
  UserProperties.setProperty("E_F_T_subject prefix", subject_prefix);
  UserProperties.setProperty("E_F_T_unique trigger id", trigger_id);
}

//-------------------------------------------------------------------------------------
// Deletes the time-based trigger and user properties created from a previous
// session with this webapp.
// Asumes that this function is being called by the stopSendDaily function.
// Preconditions: Uses the user properties if they exist.
// Postconditions: Removes the user properties and the time-based trigger that was 
//                 created from a previous session.
// Returns a boolean value indicating whether a trigger was deleted or not:
//                True = trigger was deleted. False = no trigger was deleted.
//-------------------------------------------------------------------------------------
function deleteTrigger() {
  var triggerExists = false;

  // Check to make sure the "unique trigger id" user property exists
  var myKeys = UserProperties.getKeys();
  for (var i = 0; i < myKeys.length; i++) {
    if (myKeys[i] == "E_F_T_unique trigger id") {
      triggerExists = true;
      break;
    }
  }
  // Then, if the "unique trigger id" property exists, delete the trigger
  // and user properties for this webapp.
  if (triggerExists) {
    var myTriggerID = UserProperties.getProperty("E_F_T_unique trigger id");
    var triggers = ScriptApp.getScriptTriggers();
    if (triggers.length > 0) {
      for (var i = 0; i < triggers.length; i++) {
         if (triggers[i].getUniqueId() == myTriggerID) {
           // Delete trigger
           ScriptApp.deleteTrigger(triggers[i]);

           break;
         }
      }
    }
    // Delete properties
    deleteProperties();
  }
  
  // Return the status to the webapp.
  return triggerExists;
}

//-------------------------------------------------------------------------------------
// Deletes the User Properties:
// recipients, start label, end label, subject prefix, and unique trigger id.
//-------------------------------------------------------------------------------------
function deleteProperties() {
    UserProperties.deleteProperty("E_F_T_unique trigger id");
    UserProperties.deleteProperty("E_F_T_recipients");
    UserProperties.deleteProperty("E_F_T_start label");
    UserProperties.deleteProperty("E_F_T_end label");
    UserProperties.deleteProperty("E_F_T_subject prefix");
}

//-------------------------------------------------------------------------------------
// Calls forwardEmails with parameters.
// Assumes that a time-based trigger will call automaticForwarding on behalf of the 
// active user that created the trigger.
// Supplies the parameters from the active user's properties.
// Calls didLabelChange to check for missing labels. If they are missing, trigger is
// deleted.
//-------------------------------------------------------------------------------------
function automaticForwarding() {
  var app = UiApp.getActiveApplication();
  var invalidLabels = didLabelsChange();
  var missingProperties = userPropertiesWereRemoved();
  if (!invalidLabels && !missingProperties) forwardEmails(); 
  else {
   deleteTrigger();
   deleteProperties();
  }
}

//-------------------------------------------------------------------------------------
// Removes leading and trailing spaces (' ') from a string. 
//-------------------------------------------------------------------------------------
function removeLeadingTrailingSpaces(string) {
  var leading_space = false;
  var trailing_space = false;
  var mystring = string;
  var i = 0;
  if (mystring[0] == " ") { leading_space = true;}
  while (leading_space && i < mystring.length) {
    if (mystring[i] != " ") {
      leading_space = false;
      mystring = mystring.substring(i, mystring.length);
    }
    i++;
  }
  i = mystring.length-1;
  if (mystring[i] == ' ') { trailing_space = true;}
  while (trailing_space && i > 0) {
    if (mystring[i] != " ") {
      trailing_space = false;
      mystring = mystring.substring(0, i + 1);
    }
    i--;
  }
  return mystring;
}

//-------------------------------------------------------------------------------------
// Verifies whether each email address in an input string is in a valid format.
// Assumes that multiple email addresses are separated by a comma.
//-------------------------------------------------------------------------------------
function isValidEmailFormat(email) {
  var email_entry = removeLeadingTrailingSpaces(email);
  var isValid = true;
  var numCommas = 0;
  var numAts = 0;
  
  for (var i = 0; i < email_entry.length; i++) {
    if (email_entry[i] == ',') { numCommas++; }
    if (email_entry[i] == '@') { numAts++; }
  }
  
  // Split string into substrings for each address
  var addresses = email_entry.split(',');
  
  //Logger.log(" commas = " + numCommas + " numAts= " + numAts);
  
  // return false if commas are missing
  if (numCommas != numAts - 1) {
    return false;
  }
  
  // For each address, verify that it is the correct format.
  // Set flag to false and break of loop if email is not correct
  for (var i = 0; i < addresses.length; i++) {
    isValid = emailStringChecker_( addresses[i] );
    if (!isValid) { break; }
  }
  Logger.log('after emailStringChecker_ ' + new Date());
  return isValid;
}

//-------------------------------------------------------------------------------------
// Helper method for isValidEmail
//-------------------------------------------------------------------------------------
function emailStringChecker_(input) {
   var re = /[a-zA-Z0-9\._-]+@[a-zA-Z0-9-\.]+\.[a-zA-Z]{2,4}$/;
   return re.test(input);
} 

//-------------------------------------------------------------------------------------
// Checks whether a given Gmail label exists.
//-------------------------------------------------------------------------------------
function isValidLabel(label) {
  try{
  var folder = removeLeadingTrailingSpaces(label);
  folder = GmailApp.getUserLabelByName(folder);
  }
  catch(err){
    //catch "service invoked too many times" error.
    Utilities.sleep(10000);
  }
  if (!folder) {return false};
  return true;
}

//-------------------------------------------------------------------------------------
// Gets all Gmail messages under a given label.
//-------------------------------------------------------------------------------------
function getMessagesForLabel(label) {
  //var label = 'Notes/test forward';
  var folder, threads, msg, msgs, all_messages, i, j, threadCount;
  var subj,subjs;
  var all_subjects = new Array();
  folder = GmailApp.getUserLabelByName(label); 
  all_messages = new Array();
  threads = folder.getThreads();
  threadCount = 0;
  var now = new Date();
  for (i = 0; i < threads.length; i++) {
    var loopTime = new Date();
    var timeElapsed = parseInt(loopTime - now);
    if (timeElapsed > 285000){
      preemptTimeout('getMessagesForLabel');
      Logger.log("PreemptTimeout activated!");
    }
    threadCount += 1;
    try{
    msgs = threads[i].getMessages();
    }
    catch(err){
      //MailApp.sendEmail('aponte@lbl.gov', 'ERROR getMessagesForLabel', 'the error was ' + err);
      Utilities.sleep(1000);
    }
    var now = new Date();
    for (j = 0; j < msgs.length; j++) {  
      var loopTime = new Date();
      var timeElapsed = parseInt(loopTime - now);
      if (timeElapsed > 28500){
        preemptiveTimeout('getMessagesForLabel');
        Logger.log('preemtTimeout activated!');
      }
      msg = msgs[j];
      subj = msg.getSubject();
      all_messages.push(msg);
      all_subjects.push(subj);
      Logger.log('Subject ' + i + " " +  subj);
      if(msgs.length == 0){break;}
    }
    //if(threadCount == 50){
      //Utilities.sleep(10000);
      //threadCount = 0;
    //}
    //Logger.log("Thread "+i+" processed and threadCount = "+threadCount);
    
  }
  ScriptProperties.setProperty('num_threads', threadCount);
  return [all_messages, all_subjects];
}


//-------------------------------------------------------------------------------------
// Forwards a message with a custom subject and HTML body. 
// Appends a 'tag' to the front of the subject line.
//-------------------------------------------------------------------------------------
function customForward(addressTo, subjectTag, msg) {
  var HTML_Content = "<p>------ Beginning of forwarded message ------</p>" +
                     "<p> " +
                        "<b>From: </b>" + msg.getFrom() + "<br />" +
                        "<b>Date: </b>" + msg.getDate() + "<br />" +
                        "<b>To: </b>" + msg.getTo() + "<br />" +
                        "<b>Cc: </b>" + msg.getCc() + "<br />" +
                        "<b>Subject: " + msg.getSubject() + "</b><br />" +
                        "</p>" + msg.getBody(); 
  var HTML_Content =  { htmlBody: HTML_Content, 
                      attachments : msg.getAttachments() };
  if(subjectTag == "" || !subjectTag) {
    var theTag = "";
  }
  else {
    var theTag = subjectTag + ": ";
  }
  var success = true;
  try {
    GmailApp.sendEmail(addressTo, theTag + msg.getSubject(), 
                     msg.getBody(), HTML_Content );
  }
  catch(err) {
    var success = false;
  }
  return success;
}

//-------------------------------------------------------------------------------------
// Moves threads out of one Gmail label and into another.
//-------------------------------------------------------------------------------------
function moveToFromLabels(startLabel, endLabel) {
  var start_folder = GmailApp.getUserLabelByName(startLabel); 
  var end_folder = GmailApp.getUserLabelByName(endLabel); 
  var page;
  var now = new Date();
  while (!page || page.length == 100) {
    var loopTime = new Date();
    var timeElapsed = Math.abs((parseInt(loopTime) - parseInt(now)));
    if (timeElapsed > 28000){
      Logger.log('peemtTiemout activated moveToFromLabels');
      preemptTimeout('moveToFromLabels');
    }
    
    try{
    page = start_folder.getThreads(0,100);
    end_folder.addToThreads(page);
    start_folder.removeFromThreads(page);
    }
    catch(error){
      //cath "service invoked too many times error"
      Utilities.sleep(1000);
    }
  } 
}

//-------------------------------------------------------------------------------------
// Main Function: For each email thread in the user's START label:
//                   1) forward the thread to the user's recipients.
//                   2) move the thread out of START and place in the END label
//                      in the user's inbox.
// **** NOTE: ************************************************************************
// If the user chooses to "Send Now", no User Properties will be needed. If the script
// is being called a time-based trigger on behalf of a user, then User Properties will
// be supplied instead of function parameters.
//-------------------------------------------------------------------------------------
function forwardEmails() {

  var app = UiApp.getActiveApplication();
  // Get User Properties if needed.
  if(arguments.length == 0) {
    var recipients = UserProperties.getProperty("E_F_T_recipients");
    var start_label = UserProperties.getProperty("E_F_T_start label");
    var end_label = UserProperties.getProperty("E_F_T_end label");
    var subject_prefix = UserProperties.getProperty("E_F_T_subject prefix");
  }
  else {
    var recipients = arguments[0];
    var start_label = arguments[1];
    var end_label = arguments[2];
    var subject_prefix = arguments[3];
  }
  var body = '';
  var errorFlag = false;
  //confirm start and end labels are still valid
  if (!isValidLabel(start_label)) {
    body += 'Error: The START label you entered, ' + start_label + ', does not exist. ' + 
            'Please visit the Email Forwarding Tool and modify the label settings.';
    errorFlag = true;
  }
  if (!isValidLabel(end_label)) {
    body += 'Error: The END label you entered, ' + end_label + ', does not exist. ' + 
            'Please visit the Email Forwarding Tool and modify the label settings.';
    errorFlag = true;
  }
  
  //if the labels are no longer valid, send and email and quit
  if(errorFlag == true) {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), "Daily Email Forwarding Error", body);
    return;
  }
  
  // Get emails to forward from start label.
  var mes_subj = getMessagesForLabel(start_label);
  var messages = mes_subj[0];
  var subjects = mes_subj[1];
  // Forward messages one-by-one.
  for (var i = 0; i < messages.length; i++) {
     var msg = messages[i];
     var confirm = false;  
     //Logger.log(msg)
     confirm = customForward(recipients, subject_prefix, msg);
     //Logger.log(subject_prefix);
    if (confirm) { 
      // Move emails from Start to End label only if the forwarding is successful.
      moveToFromLabels(start_label, end_label);
      
    }
  }
    confirmation(subjects);
  }


  


//-------------------------------------------------------------------------------------
// Notifies the user if START of END label gets deleted from inbox.
// If label was changed, return true. Else, return false.
//-------------------------------------------------------------------------------------
function didLabelsChange() {
  // Get labels from the active user's properties.
  var start_label = UserProperties.getProperty('E_F_T_start label');
  var end_label = UserProperties.getProperty('E_F_T_end label');
  var user_email = Session.getActiveUser().getEmail();
  var isChanged = false;
  var bothChanged = false;
  var subject = "Email Forwarding Tool Notification";
  var message = "";
  
  // Create an error message for missing labels.
  if (!isValidLabel(start_label) ) {
    message = "Your email label, " + start_label + ", could not be found. The Email " +
              "Forwarding Tool can no longer forward emails from your account. " +
              "If you would like to resume automated daily forwarding, please " +
              "revisit the Email Forwarding Tool to enter your new settings."
    isChanged = true;
  }

  if (!isValidLabel(end_label) ) {
    message = "Your email label, " + end_label + ", could not be found. The Email " +
              "Forwarding Tool can no longer forward emails from your account. " +
              "If you would like to resume automated daily forwarding, please " +
              "revisit the Email Forwarding Tool to enter your new settings."
    isChanged = true;
    // If both labels are missing, create an appropriate error message.
    if (!isValidLabel(start_label)) {
      message = "Your email labels, " + start_label + " and " +
               end_label + ", could not be found. The Email Forwarding " +
               "Tool will no longer forward emails from your account. " +
               "If you would like to resume automated daily forwarding, please " +
               "revisit the Email Forwarding Tool to enter your new settings.";
    }
  }
  // If any labels were changed, then send the appropriate message.
  if (isChanged) {
     GmailApp.sendEmail(user_email, subject, message);
     return true;
  }
  return false;
}

//-------------------------------------------------------------------------------------
// Checks whether the active user's (important) properties were modified. 
// If so, sends an email alerting user and deletes the trigger and user properties.
//-------------------------------------------------------------------------------------
function userPropertiesWereRemoved() {
  var subject = "Email Forwarding Tool Notification";
  var message = "";
  var user_email = Session.getActiveUser().getEmail();
  
  var recipientsMissing = true;
  var startLabelMissing = true;
  var endLabelMissing = true;
  var triggerIDMissing = true;
  
  // Check to make sure the User Properties exist.
  var myKeys = UserProperties.getKeys();
  for (var i = 0; i < myKeys.length; i++) {
    if (myKeys[i] == "E_F_T_recipients") recipientsMissing = false;
    if (myKeys[i] == "E_F_T_start label") startLabelMissing = false;
    if (myKeys[i] == "E_F_T_end label") endLabelMissing = false;
    if (myKeys[i] == "E_F_T_unique trigger id") triggerIDMissing = false;
  }
  // If any properties are missing, send an error message to user.
  if (recipientsMissing || startLabelMissing || endLabelMissing || triggerIDMissing) {
    message = "Your settings appear to have been modifed. As a result, Email " +
              "Forwarding Tool will no longer forward your emails. " +
               "If you would like to resume automated daily forwarding, please " +
               "revisit Email Forwarding Tool to your new settings.";
    GmailApp.sendEmail(user_email, subject, message);
    return true;
  }
  return false;
}

//--------------------------------------------------------------------------------------------
// Sends a confirmation email.  To be called after forwarding of emails successfully comleted.  
// Sends the subject of which messages were forwarded.
// Precondition: Subjects have already been retrieved from messages
//----------------------------------------------------------------------------------------------
function confirmation(subjects){
  var to = Session.getActiveUser().getEmail();
  var subject = "Email Forwarding Tool ---- Confirmation";
  var body1 = "The email forwarding process was succcessfully completed! \n \n  The forwarded messages were: \n";
  for (var i = 0; i < subjects.length; i++){
    body1 += (subjects[i] + ", " + "\n");
       }
  MailApp.sendEmail(to, subject, body1, noReply = true);
}



//-----------------------------------------------------------------------------------------------------------------------------------------------
//Timeout Functions
//----------------------------------------------------------------------------------------------------------------------------------------------
function removeTimeoutTrigger(theFunction) {
  var triggers = ScriptApp.getScriptTriggers();
  if (triggers.length>0) {
  for (var i=0; i<triggers.length; i++) {
  var handlerFunction = triggers[i].getHandlerFunction();
	if (handlerFunction==theFunction) {
  	ScriptApp.deleteTrigger(triggers[i]);
	}
  }
}
}

function preemptTimeout(theFunction) {
  var date = new Date();
  var newDate = new Date(date);
  newDate.setSeconds(date.getSeconds() + 60);
  ScriptApp.newTrigger(theFunction).timeBased().at(newDate).create();
}


