const next = document.getElementById('next')
let step = 1
document.getElementById('username').style.display = 'none'
next.onclick = async function (e) {
    if (step == 1) {
        step = 2
        document.getElementById('description1').innerHTML = 'Please input your ROBLOX username below.'
        document.getElementById('username').style.display = 'block'
    } else if (step == 2) {
        const valid = await fetch('/api/validate/' + document.getElementById('username')[0].value)
        const result = await valid.json()
        if (result.success == true) {
            const start = await fetch('/api/verification/start/' + document.getElementById('username')[0].value)
            localStorage.setItem('_usernameID12', document.getElementById('username')[0].value)
            const startResult = await start.json()
            if (startResult.success == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!\n\n' + startResult.error,
                })
                return
            }
            document.getElementById('description1').innerHTML = 'Please put the code below in your ROBLOX about me page and hit "next" when you are finished.<br><br>'+startResult.code
            document.getElementById('username').style.display = 'none'
            step = 3
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Your username is invalid.',
            })
            return
        }

    } else if (step == 3) {
        
        const check = await fetch('/api/verification/check/' + document.getElementById('username')[0].value)
        const checkResult = await check.json()
        if (checkResult.success == false) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You need to have the code in your status!',
            })
        } else {

            document.getElementById('description1').innerHTML = 'Success! Your user has been created! You will now be prompted to link your discord account!'
            document.getElementById('username').style.display = 'none'
            step = 4
        }

    } else if (step == 4) {
        window.location.href = 'http://localhost:3000/api/discord/link'
    }
}