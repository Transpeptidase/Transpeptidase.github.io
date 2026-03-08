document.addEventListener('DOMContentLoaded', () => {
  fetch('papers/publications.json')
    .then(response => response.json())
    .then(papers => {
      const grouped = {};
      papers.forEach(paper => {
        if (!grouped[paper.year]) {
          grouped[paper.year] = [];
        }
        grouped[paper.year].push(paper);
      });

      const container = document.getElementById('paper-list');
      container.innerHTML = '';
      const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

      sortedYears.forEach(year => {
        const yearHeader = document.createElement('h3');
        yearHeader.textContent = year;
        container.appendChild(yearHeader);

        const ul = document.createElement('ul');
        grouped[year].forEach(paper => {
          const item = document.createElement('li');

          // 高亮所有包含 "Qing Wang" 的作者名（大小写敏感匹配子串）
          const highlightedAuthors = paper.authors.map(name =>
            name.includes("Qing Wang") ? `<span class="highlight">${name}</span>` : name
          ).join(", ");

          const codeLink = paper.code ? ` <a href="${paper.code}" target="_blank" rel="noopener noreferrer" class="blue-tag">[Code]</a>` : "";

          const MAX_INLINE_AWARD = 30;
          const awardInline = paper.award && paper.award.length < MAX_INLINE_AWARD
            ? ` (<span class="award-inline">${paper.award}</span>)`
            : "";

          const awardBlock = paper.award && paper.award.length >= MAX_INLINE_AWARD
            ? `<br><span class="award">${paper.award}</span>`
            : "";

          const titleHtml = paper.link
            ? `<a href="${paper.link}" target="_blank" rel="noopener noreferrer">${paper.title}</a>`
            : `<span class="paper-title">${paper.title}</span>`;

          item.innerHTML = `
            ${paper.short ? `<strong>[${paper.short}]</strong> ` : ""}
            ${titleHtml}${codeLink}<br>
            <span class="authors">${highlightedAuthors}</span><br>
            <span class="venue-full">${paper.venue}, ${paper.year}${awardInline}</span>
            ${awardBlock}
          `;

          ul.appendChild(item);
        });
        container.appendChild(ul);
      });
    })
    .catch(error => {
      console.error('Failed to load publications:', error);
      const container = document.getElementById('paper-list');
      container.innerHTML = '<p class="paper-list-error">Failed to load publication list.</p>';
    });
});
