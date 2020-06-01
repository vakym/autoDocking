/*
-----About his code-----
This my first chrome extension. And one of my first JS application. So, the code below have smells.
email: avakym92@gmail.com
*/
var consoleHidden = true;
class Ship
{
    rollState = 0.0;
    rollSpeed = 0.0;
    pitchState = 0.0;
    pitchSpeed = 0.0;
    yawState = 0.0;
    yawSpeed = 0.0;
    xState = 0.0;
    xSpeed = 0.0;
    yState = 0.0;
    ySpeed = 0.0;
    zSpeed = 0.0;
    zState = 0.0;

    constructor() {
    }

    #updateCurrentRoll = function()
    {
        this.rollState = parseFloat($("#roll").children(".error").text().slice(0,-1));
    }

    #updateCurrentRollSpeed = function()
    {
        this.rollSpeed = parseFloat($("#roll").children(".rate").text().slice(0,-1));
    }

    #updateCurrentPitch = function()
    {
        this.pitchState = parseFloat($("#pitch").children(".error").text().slice(0,-1));
    }

    #updateCurrentPitchSpeed = function()
    {
        this.pitchSpeed = parseFloat($("#pitch").children(".rate").text().slice(0,-1));
    }

    #updateCurrentYaw = function()
    {
        this.yawState = parseFloat($("#yaw").children(".error").text().slice(0,-1));
    }

    #updateCurrentYawSpeed = function()
    {
        this.yawSpeed = parseFloat($("#yaw").children(".rate").text().slice(0,-1));
    }

    #updateCurrentX = function()
    {
        this.xState  = parseFloat($("#x-range").children(".distance").text().slice(0,-1));
    }

    #updateCurrentY = function()
    {
        this.yState = parseFloat($("#y-range").children(".distance").text().slice(0,-1));
    }

    #updateCurrentZ = function()
    {
        this.zState = parseFloat($("#z-range").children(".distance").text().slice(0,-1));
    }

    updateShipStatus()
    {
        this.#updateCurrentPitch();
        this.#updateCurrentPitchSpeed();
        this.#updateCurrentRoll();
        this.#updateCurrentRollSpeed();
        this.#updateCurrentYaw();
        this.#updateCurrentYawSpeed();
        this.#updateCurrentY();
        this.#updateCurrentZ();
        this.#updateCurrentX();
    }

    /* Controls functions */
    roll(force)
    {
        if (force < 0)
            this.#elementClick('#roll-left-button',Math.abs(force));
        if (force > 0)
            this.#elementClick('#roll-right-button',Math.abs(force));
    }

    pitch(force)
    {
        if (force < 0)
            this.#elementClick('#pitch-up-button', Math.abs(force));
        if (force > 0)
            this.#elementClick('#pitch-down-button', Math.abs(force));
    }

    yaw(force)
    {
        if (force < 0)
            this.#elementClick('#yaw-left-button', Math.abs(force));
        if (force > 0)
            this.#elementClick('#yaw-right-button', Math.abs(force));
    }

    Zmove(force)
    {
        this.zSpeed += force; 
        if (force < 0)
            this.#elementClick('#translate-down-button', Math.abs(force));
        if (force > 0)
            this.#elementClick('#translate-up-button', Math.abs(force));
    }

    Ymove(force)
    {
        this.ySpeed += force;
        if (force < 0)
            this.#elementClick('#translate-left-button', Math.abs(force));
        if (force > 0)
            this.#elementClick('#translate-right-button', Math.abs(force));
    }

    Xmove(force)
    {
        this.xSpeed += force;
        if (force < 0)
            this.#elementClick('#translate-forward-button', Math.abs(force));
        if (force > 0)
            this.#elementClick('#translate-backward-button', Math.abs(force));
    }

    #elementClick = function(elemnetName,count)
    {
        for (var i = 0; i < count; i++)
        {
            $(elemnetName).click();
        }
    }
    /*  end controls functions*/
}

var ship  = new Ship();
var timerId = setInterval(() => 
{
    if(consoleHidden && !$("#translation-controls").hasClass("hidden"))
    {
        showConsole();
        consoleHidden = false;
        appendMessage("This system was designed for Soyuz spaceship. This never tested on Crew Dragon. Use it you own risk.",1);
        appendMessage("Ship isn't ready for automatic docking. Wait.",2);
    }
    var rateSpeed = $("#rate").children(".rate").text();
    if(!consoleHidden && (rateSpeed === "-0.000 m/s" || rateSpeed === "-0.001 m/s"))
    {
        clearInterval(timerId);
        appendMessage("Start docking",2);
        startDocking();
    }
}, 5000);

async function startDocking()
{
    appendMessage("First stabilization of yaw, pitch, roll",2);
    await FirstRPYStab();
    appendMessage("Stabilized",2);
    appendMessage("First stabilization of Y,Z axis",2);
    await TranslateMove(5,0,0,0);
    appendMessage("Stabilized",2);
    appendMessage("Final approach",2);
    await TranslateMove(0.2,0,0,0);
    appendMessage("All done!",2);
}

async function TranslateMove(x,y,z, maxSpeed)
{
    var promise = new Promise((resolve, reject) => {
        var id = setInterval(()=>{
        ship.updateShipStatus();
        stabilizateRPY();
        stabilizateTranslate(x,y,z,maxSpeed);
        if(RPYStabilizated() && translateStabilizated(x,y,z))
        {
            clearInterval(id);
            resolve(true);
        }
    },100);
    });
    return await promise;
}

async function FirstRPYStab()
{
    var promise = new Promise((resolve, reject) => {
        var id = setInterval(()=>{
            ship.updateShipStatus();
        stabilizateRPY();
        if(RPYStabilizated())
        {
            clearInterval(id);
            resolve(true);
        }
    },100);
    });
    return await promise;
}

function RPYStabilizated()
{
    return  ship.rollState === 0 && ship.rollSpeed === 0 &&
            ship.yawState === 0 && ship.yawSpeed === 0 &&
            ship.pitchState === 0 && ship.pitchSpeed === 0; 

}

function translateStabilizated(x,y,z)
{
    return  ship.zState === z && ship.zSpeed === 0 &&
            ship.yState === y && ship.ySpeed === 0 &&
            ship.xState === x && ship.xSpeed === 0;
}

function stabilizateRPY()
{
        ship.roll(getSteps(ship.rollState, ship.rollSpeed));
        ship.pitch(getSteps(ship.pitchState, ship.pitchSpeed));
        ship.yaw(getSteps(ship.yawState, ship.yawSpeed));
}

function stabilizateTranslate(x, y, z, maxSpeed)
{
    ship.Zmove(getTransSteps(ship.zState - z, ship.zSpeed,maxSpeed));
    ship.Ymove(getTransSteps(ship.yState - y, ship.ySpeed,maxSpeed));
    ship.Xmove(getTransSteps(ship.xState - x, ship.xSpeed,maxSpeed));
}

function getTransSteps(currentPosition,currentSpeed,maxSpeed)
{
    
    if(currentPosition !== 0 && currentSpeed === 0)
    {
        if(maxSpeed!==0)
            return (maxSpeed/0.1)*-1;
        else
            return ((currentPosition/0.1)/4)*-1;
    }
    if((currentPosition > 0 && currentSpeed < 0) ||
       (currentPosition < 0 && currentSpeed > 0))
        if(Math.abs(currentPosition) < 1.0 && Math.abs(currentSpeed) > 1)
            return (currentSpeed*-1)-1;
        else
            return 0;
    else
         return (currentSpeed*-1) + ((currentPosition/0.1)/4)*-1
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

/* UI functions */
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
/* end UI functions */