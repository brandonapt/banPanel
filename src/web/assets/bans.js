function generateRandomString() {
    let randomString = "";
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
      randomString += String.fromCharCode(
        33 + Math.floor(Math.random() * 94)
      );
    }

    return randomString;
  }
  const randomString = generateRandomString();
  window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    let [accessToken, tokenType, state] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
      fragment.get("state"),
    ];
    if (accessToken || tokenType || state) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenType", tokenType);
      if (!accessToken) {
        const randomString = generateRandomString();
        localStorage.setItem("oauth-state", randomString);

      }

      if (
        localStorage.getItem("oauth-state") !==
        atob(decodeURIComponent(state))
      ) {
      }
    } else {
      accessToken = localStorage.getItem("accessToken");
      tokenType = localStorage.getItem("tokenType");
    }

    if (!accessToken || !tokenType) return (window.location.href = `https://discord.com/api/oauth2/authorize?client_id=962427659437105182&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fbans&response_type=token&scope=identify&state=${encodeURIComponent(btoa(randomString))}`);
    fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then((result) => result.json())
      .then((response) => {
        localStorage.setItem("id", response.id);
        localStorage.setItem("accesToken", accessToken);
        localStorage.setItem("tokenType", tokenType);
      });
  };