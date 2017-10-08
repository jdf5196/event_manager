'use strict';

//Declare variables
var eventDiv = document.getElementById('eventDiv'),
addDiv = document.getElementById('addDiv'),
allDiv = document.getElementById('allDiv'),
eventDetails = document.getElementById('eventDetails'),
inviteDetails = document.getElementById('inviteDetails'),
invitedList = document.getElementById('invitedList'),
addGuestForm = document.getElementById('add-guest-form'),
addBtn = document.getElementById('add-btn'),
closeBtn = document.getElementById('close-btn'),
addGuestBtn = document.getElementById('addGuestBtn'),
guestTable = document.getElementById('guestTable'),
addGuestTable = document.getElementById('addGuestTable'),
sendBtn = document.getElementById('sendBtn'),
sendMessageForm = document.getElementById('send-message-form'),
closeMsg = document.getElementById('close-msg-btn'),
sendMsgBtn = document.getElementById('sendMsgBtn'),
mainFocus = eventDetails,
focus = eventDiv,
fix = false,
add = false;

//Onclick Navbar functionality
addDiv.onclick = ()=>{
    if(focus != addDiv && mainFocus != inviteDetails){
        addDiv.classList.add('focus');
        addDiv.classList.remove('noFocus');
        focus.classList.remove('focus');
        focus.classList.add('noFocus');
        mainFocus.classList.remove('shown');
        mainFocus.classList.add('notShown');
        inviteDetails.classList.add('shown');
        inviteDetails.classList.remove('notShown');
        mainFocus = inviteDetails;
        focus = addDiv;
    }
};

eventDiv.onclick = ()=>{
    if(focus != eventDiv && mainFocus != eventDetails){
        eventDiv.classList.add('focus');
        eventDiv.classList.remove('noFocus');
        focus.classList.remove('focus');
        focus.classList.add('noFocus');
        mainFocus.classList.remove('shown');
        mainFocus.classList.add('notShown');
        eventDetails.classList.add('shown');
        eventDetails.classList.remove('notShown');
        mainFocus = eventDetails;
        focus = eventDiv;
    }
};

allDiv.onclick = ()=>{
    if(focus != allDiv && mainFocus != invitedList){
        allDiv.classList.add('focus');
        allDiv.classList.remove('noFocus');
        focus.classList.remove('focus');
        focus.classList.add('noFocus');
        mainFocus.classList.remove('shown');
        mainFocus.classList.add('notShown');
        invitedList.classList.add('shown');
        invitedList.classList.remove('notShown');
        mainFocus = invitedList;
        focus = allDiv;
    }
};

addBtn.onclick = ()=>{
    if(add === false){
        document.querySelector('body').classList.add('noScroll');
        addGuestForm.classList.remove('notShown');
        add = true
    }
};

closeBtn.onclick = ()=>{
    if(add === true){
        document.querySelector('body').classList.remove('noScroll');
        addGuestForm.classList.add('notShown');
        add = false
    }
}

//Build the event details page using information from the data.js file
(function getEvent(){
    eventDetails.innerHTML = '';
    var open = '';
    if(Event.Public === false){
        open = 'Invite Only'
    }else{
        open = 'Open to Public'
    };
    eventDetails.innerHTML = `<h2>Event Details:</h2><br />
    <p>Description: ${Event.Description}</p>
    <p>Ticket Price: $${Event.Ticket_Price}</p>
    <p>Date & Time: ${Event.Date}</p>
    <p>${open}</p>
    <p>Location: ${Event.Location}</p>
    <div class='gMap'>
        <div id="map"></div>
    </div>`
})()

//Manage error and success notifications
function showTooltip(text, type){
    var tooltipText = document.getElementById('tooltipText'),
    tooltip = document.getElementById('tooltip');
    tooltipText.innerHTML = text;
    tooltip.classList.add('show');
    tooltip.classList.remove('hide');
    if(type === 'Error'){
        tooltip.classList.add('error');
    }else if(type === 'Info'){
        tooltip.classList.add('info');
    }else{
        tooltip.classList.add('success')
    }
    setTimeout(()=>{
        tooltip.classList.add('hide');
        tooltip.classList.remove('show');
        tooltip.classList.remove('error');
        tooltip.classList.remove('success');
    }, 5000)
};

//Manage invitation page data 
function buildTable(){
    if(AddGuests.length > 0){
        guestTable.innerHTML = `<tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Guests</th>
                                    <th>Delete?</th>
                                </tr>`;
        AddGuests.map((guest)=>{
            var newGuest = document.createElement('tr');
            var index = AddGuests.indexOf(guest);
            newGuest.setAttribute('id', `guest-${index}`);
            newGuest.innerHTML = `<td>${guest.name}</td>
                                  <td>${guest.email}</td>
                                  <td>${guest.number}</td>
                                  <td><button onclick="deleteGuest(${index})">Delete</button></td>`;
            guestTable.appendChild(newGuest);
        });
        var sendBtn = document.getElementById('sendBtn');
        if(sendBtn){
            addGuestTable.removeChild(sendBtn);
        }
        var btn = document.createElement('button');
        if(AddGuests.length === 1){
            btn.innerHTML = 'Send Invitation';
        }else{
            btn.innerHTML = 'Send Invitations';
        }
        btn.setAttribute('class', 'send-btn');
        btn.setAttribute('id', 'sendBtn');
        btn.setAttribute('onclick', "sendInvite()")
        addGuestTable.appendChild(btn);
    }else{
        guestTable.innerHTML = '';
        var sendBtn = document.getElementById('sendBtn');
        if(sendBtn){
            addGuestTable.removeChild(sendBtn);
        }
    }
} 

//delete attendee information before sending invitation
function deleteGuest(id){
    AddGuests.splice(id, 1);
    buildTable();
}

//build form to add a guest to send an invitation
function additionalGuests(){
    var name = document.getElementById('addName'),
    email = document.getElementById('addEmail'),
    num = document.getElementById('addNum'),
    price = document.getElementById('addPrice'),
    message = document.getElementById('addMessage'),
    guest = {
        name: name.value,
        email: email.value,
        number: num.value,
        price: price.value,
        message: message.value,
        time: new Date().toString().slice(0, 10),
        status: 'Recieved'
    };
    if(!name.value || !email.value || !num.value || !price.value || !message.value){
        showTooltip('Please Fill Out All Fields', 'Error');
    }else{
        AddGuests.push(guest);
        name.value = '';
        email.value = '';
        num.value = '';
        price.value = '$15';
        message.value = 'Hope you can make it! \n\nBest, \n\nChristopher';
        if(add === true){
            document.querySelector('body').classList.remove('noScroll');
            addGuestForm.classList.add('notShown');
            add = false
        }
        buildTable();
    }
}

//manage add guest button
addGuestBtn.onclick = ()=>{
    additionalGuests();
};

//build guest list tables from data.js file
var showInvited=()=>{
    var theInvitedTable = document.getElementById('theInvited'),
    recievedList = document.getElementById('recievedList'),
    notAttendingList = document.getElementById('notAttendingList'),
    tableHeader = `<tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Email</th>
                        <th>Invitation Sent</th>
                        <th>Send Message?</th>
                   </tr>`;
    theInvitedTable.innerHTML = tableHeader;
    recievedList.innerHTML = tableHeader;
    notAttendingList.innerHTML = tableHeader;
    Data.map((invited)=>{
        var index = Data.indexOf(invited);
        var aInvited = document.createElement('tr');
        aInvited.setAttribute('id', `invited-${index}`);
        aInvited.innerHTML = `<td>${invited.name}</td>
                              <td><p class='${invited.status}'>${invited.status}</p></td>
                              <td>${invited.email}</td>
                              <td>${invited.time}</td>
                              <td><button onclick='openMessage(${index})'>Message</button></td>`
        if(invited.status === 'Attending'){
            theInvitedTable.appendChild(aInvited);
        }else if(invited.status === 'Recieved'){
            recievedList.appendChild(aInvited);
        }else{
            notAttendingList.appendChild(aInvited);
        }
    })
};
showInvited();
function sendInvite(){
    if(AddGuests.length === 1){
        showTooltip('Invitation Sent!');
    }else if(AddGuests.length > 1){
        showTooltip('Invitations Sent!');
    }
    AddGuests.map((data)=>{
        Data.push(data)
    });
    AddGuests = [];
    buildTable();
    showInvited();
}

//open message form
function openMessage(id){
    var person = Data[id],
    messageName = document.getElementById('messageName'),
    messageEmail = document.getElementById('messageEmail');
    messageName.setAttribute('value', person.name);
    messageEmail.setAttribute('value', person.email);
    sendMessageForm.classList.remove('notShown');
    document.querySelector('body').classList.add('noScroll');
}

//close message form
closeMsg.onclick = ()=>{
    sendMessageForm.classList.add('notShown');
    document.querySelector('body').classList.remove('noScroll');
}

//send message and close message form
function sendMessage(){
    var messageTa = document.getElementById('messageTa');
    if(!messageTa.value || messageTa.value === ''){
        showTooltip('Please Fill Out All Fields', 'Error');
    }else{
        sendMessageForm.classList.add('notShown');
        document.querySelector('body').classList.remove('noScroll');
        showTooltip('Message Sent!', 'Success');
        messageTa.value = '';
    }
}

//manage send message button
sendMsgBtn.onclick = ()=>{
    sendMessage();
}