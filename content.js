var consoleHidden = true;
var rollState = 0.0;
var rollSpeed = 0.0;
var pitchState = 0.0;
var pitchSpeed = 0.0;
var yawState = 0.0;
var yawSpeed = 0.0;
var timerId = setInterval(() => 
{
    if(consoleHidden && !$("#translation-controls").hasClass("hidden"))
    {
        showConsole();
        consoleHidden = false;
        appendMessage("This system was designed for Soyuz spaceship. This never tested on Crew Dragon. Use it you own risk.",1);
        appendMessage("Ship isn't ready for automatic doking. Await.",2);
    }
    var rateSpeed = $("#rate").children(".rate").text();
    if(!consoleHidden && rateSpeed === "-0.000 m/s")
    {
        clearInterval(timerId);
        appendMessage("Start docking",2);
        startDocking();
    }
}, 5000);

function readyToDock()
{
    var controlsHidden = $("#translation-controls").hasClass("hidden");
    var rateSpeed = $("#rate").children(".rate").text();
    return rateSpeed === "-0.000 m/s" && !controlsHidden;
}

function showConsole()
{
    $('body').append(
    `<div id="console" class="console">
        <div id="header" class="consoleHeader">
            <p>Welcome to autoDock system</p>
        </div>
        <hr>
        <div>
            <ul id='consoleMessages' class="consoleList">
            </ul>
        </div>
    </div>`);
}

function appendMessage(message,type)
{
    messageString = '';
    switch(type) {
        case 1:  
          messageString += `<span style="color: yellow;">[WARNING]</span>`;
          break;
      
        case 2:  
            messageString += `<span style="color:greenyellow">[INFO]</span>`;
            break;
      }
    $('#consoleMessages').append(`<li style="color: white;">${messageString} ${message}</li>`);
}

function roll(force)
{
    if (force < 0)
        elementClick('#roll-left-button',Math.abs(force));
    if (force > 0)
        elementClick('#roll-right-button',Math.abs(force));
}

function pitch(force)
{
    if (force < 0)
        elementClick('#pitch-up-button', Math.abs(force));
    if (force > 0)
        elementClick('#pitch-down-button', Math.abs(force));
}

function yaw(force)
{
    if (force < 0)
        elementClick('#yaw-left-button', Math.abs(force));
    if (force > 0)
        elementClick('#yaw-right-button', Math.abs(force));
}

function startDocking()
{
    appendMessage("First stabilization of yaw, pitch, roll",2);
    stabilizateRPY();
    appendMessage("Stabilized",2);
}

function stabilizateRPY()
{
    var timerRPY = setInterval(() => 
    {
        updateCurrentRoll();
        updateCurrentRollSpeed();
        updateCurrentPitch();
        updateCurrentPitchSpeed();
        updateCurrentYaw();
        updateCurrentYawSpeed();
        roll(getSteps(rollState,rollSpeed));
        pitch(getSteps(pitchState,pitchSpeed));
        yaw(getSteps(yawState,yawSpeed));
    },100);
}

function getSteps(currentPosition,currentSpeed)
{
    if(currentPosition !== 0 && currentSpeed === 0)
        return (currentPosition/0.1)/4;
    var steps = currentPosition / (currentSpeed / 10);
    if(steps < 5 && steps !== 0)
        return (currentSpeed/0.1)/2*-1;
    if(steps === 0)
        return (currentSpeed/0.1)*-1;
}

function elementClick(elemnetName,count)
{
    for (var i = 0; i < count; i++)
    {
        $(elemnetName).click();
    }
}


function updateCurrentRoll()
{
    rollState = parseFloat($("#roll").children(".error").text().slice(0,-1));
}

function updateCurrentRollSpeed()
{
    rollSpeed = parseFloat($("#roll").children(".rate").text().slice(0,-1));
}

function updateCurrentPitch()
{
    pitchState = parseFloat($("#pitch").children(".error").text().slice(0,-1));
}

function updateCurrentPitchSpeed()
{
    pitchSpeed = parseFloat($("#pitch").children(".rate").text().slice(0,-1));
}

function updateCurrentYaw()
{
    yawState = parseFloat($("#yaw").children(".error").text().slice(0,-1));
}

function updateCurrentYawSpeed()
{
    yawSpeed = parseFloat($("#yaw").children(".rate").text().slice(0,-1));
}

