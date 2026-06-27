export function renderGitHubRepos(container, repos) {
  if (!container) return;
  if (!repos.length) {
    container.innerHTML = `
      <article class="github-repo">
        <strong>No repositories loaded yet</strong>
        <p>The GitHub API may be rate-limited. The portfolio projects above remain available regardless.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = repos
    .slice(0, 3)
    .map(
      (repo) => `
        <article class="github-repo">
          <div>
            <strong>${repo.name}</strong>
            <p>${repo.description || 'Repository synced from GitHub.'}</p>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">Open</a>
        </article>
      `
    )
    .join('');
}
