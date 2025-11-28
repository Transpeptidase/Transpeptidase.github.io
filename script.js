document.addEventListener('DOMContentLoaded', () => {
  fetch('papers/publications.json')
    .then(response => response.json())
    .then(papers => {
      // 统计会议数量
      const conferenceCount = {};
      papers.forEach(paper => {
        if (paper.short) {
          // 提取会议名称（去掉年份后缀，如'22, '23等）
          const conferenceName = paper.short.replace(/'?\d{2}$/, '').trim();
          conferenceCount[conferenceName] = (conferenceCount[conferenceName] || 0) + 1;
        } else {
          // 没有short字段的认为是中文期刊
          conferenceCount['Chinese-language journal'] = (conferenceCount['Chinese-language journal'] || 0) + 1;
        }
      });

      // 按数量排序
      const sortedConferences = Object.entries(conferenceCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => `${name} (${count})`)
        .join(', ');

      // 生成论文分组
      const grouped = {};
      papers.forEach(paper => {
        if (!grouped[paper.year]) {
          grouped[paper.year] = [];
        }
        grouped[paper.year].push(paper);
      });

      const container = document.getElementById('paper-list');
      
      // 插入汇总统计
      if (sortedConferences) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'conference-summary';
        summaryDiv.innerHTML = `<p><strong>Conference Summary:</strong> ${sortedConferences}</p>`;
        container.appendChild(summaryDiv);
      }

      const sortedYears = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

      sortedYears.forEach(year => {
        const yearHeader = document.createElement('h3');
        yearHeader.textContent = year;
        container.appendChild(yearHeader);

        const ul = document.createElement('ul');
        grouped[year].forEach(paper => {
          const item = document.createElement('li');
          item.style.marginBottom = "8px";

          // 高亮所有包含 "Qing Wang" 的作者名（大小写敏感匹配子串）
          const highlightedAuthors = paper.authors.map(name =>
            name.includes("Qing Wang") ? `<span class="highlight">${name}</span>` : name
          ).join(", ");

          const codeLink = paper.code ? ` <a href="${paper.code}" target="_blank" class="bule-tag">[Code]</a>` : "";

          const max_inline_award_length = 30
          const awardInline = paper.award && paper.award.length < max_inline_award_length
            ? ` (<span class="award-inline">${paper.award}</span>)`
            : "";

          const awardBlock = paper.award && paper.award.length >= max_inline_award_length
            ? `<br><span class="award">${paper.award}</span>`
            : "";

          item.innerHTML = `
            ${paper.short ? `<strong>[${paper.short}]</strong> ` : ""}
            <a href="${paper.link}" target="_blank">${paper.title}</a>${codeLink}<br>
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
      container.innerHTML = '<p>Failed to load publication list.</p>';
    });
});
