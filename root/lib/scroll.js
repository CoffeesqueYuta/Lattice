function smoothScrollToId(id, duration = 600) {
    const target = getElementByIdDeep(id);
    if (!target) return;

    let container = 
        document.querySelector('.scroll-area') ??
        document.querySelector('body > div.content');
    if (!container) return;

    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;

    const start = container.scrollTop;
    const end = start + target.getBoundingClientRect().top - container.getBoundingClientRect().top - headerHeight;

    const distance = end - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 
            progress < 0.5 ? 
            4 * progress * progress : 
            1 - Math.pow(-2 * progress + 2, 3) / 2;
        container.scrollTop = start + distance * ease;
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    requestAnimationFrame(animateScroll);
}