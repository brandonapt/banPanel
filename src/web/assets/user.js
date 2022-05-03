async function setAvatarName() {
    const usernameSpace = document.getElementById('username-space');
    const rawData = await fetch('/api/userinfo/')
    const data = await rawData.json()
    usernameSpace.innerHTML = `             <img id="avatar" src="https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png" /><br><b>${data.username}#${data.discriminator}</b>`;
    console.log(data)
    document.getElementById('welcome').innerHTML = `<b>welcome, ${data.username}</b>`;
    return data
}

setAvatarName()