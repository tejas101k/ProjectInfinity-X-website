document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  document.querySelectorAll('.faq-content').forEach(section => {
    section.classList.remove('collapsed');
    section.querySelectorAll('.faq-item').forEach((item, i) => {
      const [question, answer] = item.querySelectorAll('.faq-question, .faq-answer');
      question.classList.toggle('collapsed', i !== 0);
      answer.classList.toggle('collapsed', i !== 0);
    });
  });


  faqQuestions.forEach(question => {
    question.addEventListener('click', e => {
      e.stopPropagation();
      toggleItem(question);
    });
  });

  document.querySelectorAll('.faq-question').forEach(el => {
    el.tabIndex = 0;
    el.role = 'button';
    el.ariaExpanded = 'true';
  });

  document.addEventListener('keydown', e => {
    if (['Enter', ' '].includes(e.key) && e.target.matches('.faq-question')) {
      e.preventDefault();
      e.target.classList.contains('faq-question')
        ? toggleItem(e.target)
        : toggleSection(e.target);
    }
  });
});

function toggleItem(question) {
  const answer = question.nextElementSibling;
  question.classList.toggle('collapsed');
  answer.classList.toggle('collapsed');
}

function toggleSection(header) {
  const content = header.nextElementSibling;
  const collapsed = content.classList.toggle('collapsed');
  header.classList.toggle('collapsed', collapsed);

  if (!collapsed) {
    content.querySelectorAll('.faq-question, .faq-answer')
      .forEach(el => el.classList.remove('collapsed'));
  }
}
