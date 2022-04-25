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
            var dialog2 = document.querySelector('#update-dialog');
            if (! dialog2.showModal) {
              dialogPolyfill.registerDialog(dialog2);
            }
            dialog.showModal();
            updateButton.disabled = true;
            downloadButton.disabled = true;
            dialog.querySelector('button:not([disabled])')
            document.getElementById('continue').addEventListener('click', async () => {
                dialog.close();
                dialog2.showModal();
                fetch(window.location.origin + '/api/update/start').then(() => {
                    dialog2.close();
                    snackbarContainer.MaterialSnackbar.showSnackbar({
                        message: 'Update finished!',
                        timeout: 2000
                    });
                    updateButton.disabled = false;
                    downloadButton.disabled = false;
                }
                )
            })
            .addEventListener('click', function() {
              dialog.close();
              updateButton.disabled = false;
              downloadButton.disabled = false;
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
