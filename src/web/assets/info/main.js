window.onload = async function () {
    let info = await fetch('http://localhost:3000/api/game/info')
    info = await info.json()
    const children = document.getElementById('pl').children
    // delete all children
    setTimeout(async function () {

        let info = await fetch('http://localhost:3000/api/game/info')
        info = await info.json()
        let players = await fetch('http://localhost:3000/api/players/get')
        players = await players.json()
        for (i in players) {
            let thumb = await fetch('http://localhost:3000/api/thumbnail/big/' + players[i])
            thumb = await thumb.json()
            let player = document.createElement('p')
            player.innerHTML = `<img src='${thumb[0].imageUrl}'/><br><b>${players[i]}</b>`
            let banButton = document.createElement('button')
            banButton.className = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent'
            banButton.innerHTML = 'Ban'
            console.log(players[i])
            banButton.onclick = async function (e) {
                let response = await fetch('http://localhost:3000/api/ban/user/' + players[i], {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                let result = await response.json()
                player.remove()
                banButton.remove()
                if (result.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'User has been banned.',
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                }
            }
            document.getElementById('pl').appendChild(player)
            player.appendChild(banButton)
        }
    }, 100)

    document.getElementById('reload').onclick = async function (e) {
        window.location.reload()
    }
}

