const downloadButton = document.getElementById("download");
const updateButton = document.getElementById("update");
const developerButton = document.getElementById("developer");
const stableButton = document.getElementById("stable");
var snackbarContainer = document.querySelector("#error-snackbar");
downloadButton.addEventListener("click", () => {
  // have it download /api/loader/download
  window.location.href = "/api/loader/download";
});

updateButton.addEventListener("click", async () => {
  let raw = await fetch(window.location.origin + "/api/update/check");
  const data = await raw.json();
  if (data.success === true) {
    if (data.update === true) {
      let raw = await fetch(window.location.origin + "/api/changelog/get");
      const changelog = await raw.json();
      document.getElementById("changelog").innerHTML =
        changelog.changelog +
        "<br><br>" +
        "<b>Version:</b> " +
        changelog.version;
      var dialog = document.querySelector("#dialog");
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
      }
      var dialog2 = document.querySelector("#update-dialog");
      if (!dialog2.showModal) {
        dialogPolyfill.registerDialog(dialog2);
      }
      dialog.showModal();
      updateButton.disabled = true;
      downloadButton.disabled = true;
      dialog
        .querySelector("button:not([disabled])")
        .addEventListener("click", function () {
          dialog.close();
          updateButton.disabled = false;
          downloadButton.disabled = false;
        });
      document
        .getElementById("continue")
        .addEventListener("click", async () => {
          dialog.close();
          dialog2.showModal();
          fetch(window.location.origin + "/api/update/start").then(() => {
            dialog2.close();
            snackbarContainer.MaterialSnackbar.showSnackbar({
              message: "Update finished!",
              timeout: 2000,
            });
            updateButton.disabled = false;
            downloadButton.disabled = false;
          });
        });
    } else {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "No updates available!",
        timeout: 2000,
      });
    }
  } else {
    var snackbarData = {
      message: "Error checking for updates",
      timeout: 2000,
      actionText: "Okay",
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(snackbarData);
  }
});

stableButton.onclick = async function () {
  const raw = await fetch(window.location.origin + "/api/settings/branch/set", {
    method: "POST",
    body: false,
  });
  const data = await raw.json();
  if (data.success === true) {
    snackbarContainer.MaterialSnackbar.showSnackbar({
      message: "Successfully changed the branch to stable!",
      timeout: 2000,
    });
  }
};

developerButton.onclick = async function () {
  var dialog = document.querySelector("#confirm-branch");
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
  dialog.showModal();
  dialog
    .querySelector("button:not([disabled])")
    .addEventListener("click", function () {
      dialog.close();
    });
  document.getElementById("next").addEventListener("click", async () => {
    const raw = await fetch(
      window.location.origin + "/api/settings/branch/set",
      { method: "POST", body: true }
    );
    const data = await raw.json();
    if (data.success === true) {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Successfully changed the branch to developer!",
        timeout: 2000,
      });
    }
    dialog.close();
  });
};

document
  .getElementById("clientidform")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (document.getElementById("clientid").value == null) {
      return snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Please input a client id.",
        timeout: 2000,
      });
    }
    const dta = { clientId: document.getElementById("clientid").value };

    const raw = await fetch(
      window.location.origin + "/api/settings/clientid/set",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dta),
      }
    );
    const data = await raw.json();
    if (data.success === true) {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Successfully changed the client id!",
        timeout: 2000,
      });
    }
  });

document
  .getElementById("clientsecretform")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (document.getElementById("clientsecret").value == null) {
      return snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Please input a client secret.",
        timeout: 2000,
      });
    }
    const dta = { clientSecret: document.getElementById("clientsecret").value };

    const raw = await fetch(
      window.location.origin + "/api/settings/clientsecret/set",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dta),
      }
    );
    const data = await raw.json();
    if (data.success === true) {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Successfully changed the client secret!",
        timeout: 2000,
      });
    }
  });

  async function setGuilds() {
      const raw = await fetch(window.location.origin + "/api/user/guilds/get");
        const data = await raw.json();
        console.log(data)
        if (data.success === true) {
            for (i in data.guilds) {
                var l = document.createElement("li")
                l.innerHTML = data.guilds[i].name
                l.className = "mdl-menu__item"
                l.onclick = async function () {
                    const rw = await fetch(window.location.origin + "/api/settings/guildId/set", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ guildId: data.guilds[i].id }),
                    });
                    const dta = await rw.json();
                    if (dta.success === true) {
                        snackbarContainer.MaterialSnackbar.showSnackbar({
                            message: "Successfully changed the guild!",
                            timeout: 2000,
                        });
                    }
                }
                document.getElementById("servers").appendChild(l)
            }   
        }
  }

  setGuilds()

  document
  .getElementById("userform")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (document.getElementById("userid").value == null) {
      return snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Please input a role id.",
        timeout: 2000,
      });
    }
    const dta = { userRoleId: document.getElementById("userid").value };

    const raw = await fetch(
      window.location.origin + "/api/settings/userroleid/set",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dta),
      }
    );
    const data = await raw.json();
    if (data.success === true) {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Successfully changed the user role!",
        timeout: 2000,
      });
    }
  });
  document
  .getElementById("adminform")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (document.getElementById("adminid").value == null) {
      return snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Please input an admin id.",
        timeout: 2000,
      });
    }
    const dta = { id: document.getElementById("adminid").value };

    const raw = await fetch(
      window.location.origin + "/api/settings/adminroleid/set",
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dta),
      }
    );
    const data = await raw.json();
    if (data.success === true) {
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "Successfully changed the admin role!",
        timeout: 2000,
      });
    }
  });