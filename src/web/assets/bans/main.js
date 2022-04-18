const bansList = document.getElementById('bans')


window.onload = async function () {
    bansList.innerHTML = ''
    let bans = await fetch('http://localhost:3000/api/bans')
    bans = await bans.json()
    
    let span = document.createElement('span')
    for (i in bans) {
        let ban = bans[i]
        // get the thumbnail of the user
        let thumb = await fetch('http://localhost:3000/api/thumbnail/' + ban.username)
        thumb = await thumb.json()

        let banItem = document.createElement('p')
        banItem.innerHTML = `<img src='${thumb[0].imageUrl}'/><br><b>${ban.username}</b><br><br>${ban.bannedReason ?? 'No reason given.'}<br>`
        let banButton = document.createElement('button')
        banButton.className = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'
        banButton.innerHTML = 'Unban'
        banButton.onclick = async function (e) {
            let response = await fetch('http://localhost:3000/api/unban/' + ban.userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            let result = await response.json()
            banItem.remove()
            banButton.remove()
        
            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User has been unbanned.',
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                })
            }
        }
        span.appendChild(banItem)
        span.appendChild(banButton)
        banItem.appendChild(banButton)
        bansList.appendChild(banItem)
    }
}
