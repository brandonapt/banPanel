
    local url = 'http://localhost'

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
			plr:Kick('You are banned from this place.
Ban Reason:

No reason provided!

-Banel Systems-')
		else
			plr:Kick('You are banned from this place.
Ban Reason:

'..data.bannedReason..'

-Banel Systems-')
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
				v:Kick('You are banned from this place.
Ban Reason:

No reason provided!

-Banel Systems-')
			else
				v:Kick('You are banned from this place.
Ban Reason:

'..data.bannedReason..'

-Banel Systems-')
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
end