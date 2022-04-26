import fs from 'fs';
import path from 'path';
import fetch from 'cross-fetch';
import logger from 'loggis';

export function generateRandomString() {
    let randomString = "";
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
      randomString += String.fromCharCode(
        33 + Math.floor(Math.random() * 94)
      );
    }

    return randomString;
  }

  export function generateLuaScript (url) {
    return `
    local url = '${url}'

--------------------------------------------------------------------------------------------------------------------------------------
------------------------------DONT TOUCH ANYTHING BELOW THIS LINE-------------------------------------------------------------------------------------------------


local Players = game:GetService("Players")
local Http = game:GetService("HttpService")
local plrs = {}

game.Players.PlayerAdded:Connect(function(plr)
	local response = Http:GetAsync(url..'/api/getinfo/id/'..plr.UserId)
	local data = Http:JSONDecode(response)
	if data.banned == true then
		if data.bannedReason == nil then
			plr:Kick('You are banned from this place.\nBan Reason:\n\nNo reason provided!\n\n-Banel Systems-')
		else
			plr:Kick('You are banned from this place.\nBan Reason:\n\n'..data.bannedReason..'\n\n-Banel Systems-')
		end
	end
	for i,v in ipairs(game.Players:GetPlayers()) do
		table.insert(plrs, v.Name)
	end
	local response = Http:RequestAsync(
		{
			Url = url..'/api/players/send', 
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json" 
			},
			Body = Http:JSONEncode({players = plrs})
		}
	)
	plrs = {}
end)
game.Players.PlayerRemoving:Connect(function()
	for i,v in ipairs(game.Players:GetPlayers()) do
		table.insert(plrs, v.Name)
	end
	local response = Http:RequestAsync(
		{
			Url = url..'/api/players/send',  
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json" 
			},
			Body = Http:JSONEncode({players = plrs})
		}
	)
	plrs = {}
end)
while true do
	local players = game.Players:GetPlayers()
	for i,v in ipairs(players) do
		table.insert(plrs, v.Name)
		
		local response = Http:GetAsync(url..'/api/getinfo/id/'..v.userId)
		local data = Http:JSONDecode(response)
		if data.banned == true then
			local player = game.Players:GetPlayerByUserId(data.userId)
			if data.bannedReason == nil then
				v:Kick('You are banned from this place.\nBan Reason:\n\nNo reason provided!\n\n-Banel Systems-')
			else
				v:Kick('You are banned from this place.\nBan Reason:\n\n'..data.bannedReason..'\n\n-Banel Systems-')
			end
		end
	end
	local response = Http:RequestAsync(
		{
			Url = url..'/api/players/send',  
			Method = "POST",
			Headers = {
				["Content-Type"] = "application/json" 
			},
			Body = Http:JSONEncode({players = plrs})
		}
	)
	plrs = {}
	task.wait(2)
end`
  }

  export async function getVersion() {
	const data = fs.readFileSync(path.join(__dirname, './files/version.txt'),
	{encoding:'utf8'});
	return data;
  }

  export async function getLatestVersion() {
    const version = await fetch('https://raw.githubusercontent.com/brandoge91/banPanel/master/src/files/version.txt')
	const version2 =  await version.text();
    return version2
  }
