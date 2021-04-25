<div style="text-align: center; color: #f05151; font-size: 56px">Rada API</div>

In order to use the websocket the RadaAPI provides, you need to:<br>
Create a **JSON** response which has the following data:
```json
{
  "type": "auth", 
  "userToken": "USERTOKEN"
}
```
You then will begin to receive setting events and client events in ***REAL TIME***
<br>
It works until the session becomes disconnected in which case you will need to resend this data structure to start receiving events again.

## Current Events
> Prefix
```json
{
  "oldPrefix": String,
  "newPrefix": String,
  "member": {},
  "guild": {}
}
```