const buttons = document.querySelectorAll('button[id^="toggleButton"]');
const blocks = document.querySelectorAll('div[id^="block"]');

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const block = blocks[index];
    if (block.style.display === 'none' || block.style.display === '') {
      blocks.forEach((b) => (b.style.display = 'none'));
      block.style.display = 'block';
    } else {
      block.style.display = 'none';
    }
  });
});
