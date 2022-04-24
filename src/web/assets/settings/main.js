const downloadButton = document.getElementById('download');
const updateButton = document.getElementById('update');
var snackbarContainer = document.querySelector('#error-snackbar');
downloadButton.addEventListener('click', () => {
    // have it download /api/loader/download
    window.location.href = '/api/loader/download';

})
updateButton.addEventListener('click', async () => {
    let raw = await fetch(window.location.origin + '/api/update/check')
    const data = await raw.json();
    if (data.success === true) {
        if (data.update === true) {
            let raw = await fetch(window.location.origin + '/api/changelog/get') 
            const changelog = await raw.json();
            document.getElementById('changelog').innerHTML = changelog.changelog + '<br><br>' + '<b>Version:</b> ' + changelog.version;
            var dialog = document.querySelector('#dialog');
            if (! dialog.showModal) {
              dialogPolyfill.registerDialog(dialog);
            }
            dialog.showModal();
            updateButton.disabled = true;
            downloadButton.disabled = true;
            dialog.querySelector('button:not([disabled])')
            .addEventListener('click', function() {
              dialog.close();
            });

        }
    } else {
        var snackbarData = {
            message: 'Error checking for updates',
            timeout: 2000,
            actionText: 'Okay'
          };
          snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
    }
})
