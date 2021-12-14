function generateBadges(elementId, description) {
  fetch('https://unfoldedinc.github.io/examples/src/toc.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(response => response.json())
    .then(json => {
      const item = json.javascript.api.filter(item => {
        return item.description === description;
      })[0];
      const badgesHTML = `
        <a
          href="https://vscode.dev/${item.githubUrl}"
          target="_blank"
          class="btn vscode-btn"
          ><img
            src="https://open.vscode.dev/badges/open-in-vscode.svg"
            alt="Open in VSCode"
            class="typography__Img-sc-1pmaksm-15 hBeZII"
        /></a>
        <a
          href="https://${item.githubUrl}"
          target="_blank"
          class="btn gh-btn"
          ><img
            src="https://img.shields.io/badge/code-GitHub-%232d333b?style=flat&amp;logo=github"
            alt="GitHub"
            class="typography__Img-sc-1pmaksm-15 hBeZII"
        /></a>`;
      document.getElementById(elementId).innerHTML = badgesHTML;
    });
}
