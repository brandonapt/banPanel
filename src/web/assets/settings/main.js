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
            dialog.querySelector('button:not([disabled])').addEventListener('click', function() {
                dialog.close();
                updateButton.disabled = false;
                downloadButton.disabled = false;
              });
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


        } else {
            snackbarContainer.MaterialSnackbar.showSnackbar({
                message: 'No updates available!',
                timeout: 2000
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

document.getElementById('switch-1').onchange = async function() {
    console.log(document.getElementById('switch-1'));
    let raw = await fetch(window.location.origin + '/api/settings/branch/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            branch: document.getElementById('switch-1').value
        })
    })
    const data = await raw.json();
    if (data.success === true) {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Develper branch set to ' + document.getElementById('switch-1').value,
            timeout: 2000
        });
    } else {
        snackbarContainer.MaterialSnackbar.showSnackbar({
            message: 'Error setting branch',
            timeout: 2000
        });
    }
}