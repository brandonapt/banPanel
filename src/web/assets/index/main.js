// run preventdefault on the form submit event
let curUser
document.getElementById('info').style.display = 'none';
document.querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = e.srcElement[0].value
    let reasonText = document.getElementById('current_reason')
    reasonText.style.display = 'none'
    if (!username) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!\n\nPlease enter a username you want to ban/unban.',
          })
        return
    }
    if (username.length > 20) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!\n\nUsername is too long.',
          })
        return
    }
      const responseRaw = await fetch('/api/users/' + username)
      const user = await responseRaw.json()
      if (user.success == false) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!\n\nUser does not exist.',
          })
        return
      }
      const header = document.getElementById('infoheader')
      const thumbraw = await fetch('/api/thumbnail/' + username)
      const thumbnailURL = await thumbraw.json()
      const url = thumbnailURL[0].imageUrl
      header.innerHTML=`${user.info.username} <img src='${url}'/>`
      const status = await document.getElementById('status')
      let raw = await fetch('/api/getinfo/name/' + user.info.username)
      raw = await raw.json()
      curUser = user.info

      if (raw.banned == true) {
        reasonText.style.display = 'block'
        reasonText.innerHTML = `Reason:<br>${raw.bannedReason ?? 'No reason given.'}`
        document.getElementById('reason').value = raw.bannedReason ?? 'No reason given.'
        raw = 'Banned'
      } else if (raw.banned == false) {
        raw = 'Not Banned'
      }
      status.innerHTML = `Current Status: <b>${raw}</b>`

      document.getElementById('info').style.display = 'block';

});

document.getElementById('ban').onclick = async function (e) {
  if (!curUser) return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!\n\nPlease enter a username you want to ban/unban.',
  })
  
  const data = {reason: document.getElementById('reason').value, bannedBy: 'brandon!!!'}
  // send a post request to ban the user
  const response = await fetch('/api/ban/' + curUser.userId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  let raw = await fetch('/api/getinfo/name/' + curUser.username)
  raw = await raw.json()
  const result = await response.json()
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

  const status = await document.getElementById('status')
  let reasonText = document.getElementById('current_reason')
  reasonText.style.display = 'block'
  document.getElementById('reason').value = raw.bannedReason ?? 'No reason given.'
  reasonText.innerHTML = `Reason:<br>${raw.bannedReason ?? 'No reason given.'}`
  status.innerHTML = `Current Status: <b>Banned</b>`
}

document.getElementById("unban").onclick = async function (e) {
  if (!curUser) return Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!\n\nPlease enter a username you want to ban/unban.',
  })
  // send a post request to ban the user
  const response = await fetch('/api/unban/' + curUser.userId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const result = await response.json()
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

  const status = await document.getElementById('status')
  let reasonText = document.getElementById('current_reason')
  reasonText.style.display = 'none'
  document.getElementById('reason').value = ''
  status.innerHTML = `Current Status: <b>Not Banned</b>`
}