const downloadButton = document.getElementById('download');
const updateButton = document.getElementById('update');
var snackbarContainer = document.querySelector('#error-snackbar');
downloadButton.addEventListener('click', () => {
    // have it download /api/loader/download
    window.location.href = '/api/loader/download';

})
updateButton.addEventListener('click', async () => {
    const raw = await fetch(window.location.origin + '/api/update/check')
    const data = await raw.json();
    if (data.success === true) {
        
    } else {
        var snackbarData = {
            message: 'Error checking for updates',
            timeout: 2000,
            actionText: 'Okay'
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
    }
})
