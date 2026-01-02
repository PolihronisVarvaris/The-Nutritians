gsap.registerPlugin(ScrollTrigger);

// Get the total width of the timeline
const timelineContainer = document.querySelector('.timeline-container');
const timelineSections = gsap.utils.toArray('.timeline-section');
const timelineWrapper = document.querySelector('.timeline-wrapper');

// Calculate total width
let totalWidth = 0;
timelineSections.forEach(section => {
    totalWidth += section.offsetWidth;
});

// Set the total width of the container
timelineContainer.style.width = `${totalWidth}px`;

// Create the horizontal scroll animation
const horizontalScroll = gsap.to(timelineContainer, {
    x: () => -(totalWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
        trigger: ".timeline-wrapper",
        start: "top top", // when the top of the wrapper hits the top of the viewport
        end: () => `+=${totalWidth}`, // scroll totalWidth pixels to complete
        scrub: 1, // smooth scrubbing, 1 second to catch up
        pin: true, // pin the wrapper while scrolling
        anticipatePin: 1,
        invalidateOnRefresh: true, // recalculate on resize
        markers: false, // set to true for debugging
        onEnter: () => {
            // Add scroll indicator
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.innerHTML = '<i class="fas fa-arrow-right"></i>Scroll horizontally to continue';
            timelineWrapper.appendChild(indicator);
        },
        onLeave: () => {
            // Remove scroll indicator
            const indicator = document.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    const isInTimeline = ScrollTrigger.isInViewport(timelineWrapper);
    
    if (isInTimeline) {
        const scrollTrigger = horizontalScroll.scrollTrigger;
        const progress = scrollTrigger.progress;
        const totalProgress = scrollTrigger.end - scrollTrigger.start;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const newProgress = Math.min(1, progress + (100 / totalProgress));
            scrollTrigger.scroll(scrollTrigger.start + (newProgress * totalProgress));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const newProgress = Math.max(0, progress - (100 / totalProgress));
            scrollTrigger.scroll(scrollTrigger.start + (newProgress * totalProgress));
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate total width
    let newTotalWidth = 0;
    timelineSections.forEach(section => {
        newTotalWidth += section.offsetWidth;
    });
    
    // Update the timeline container width
    timelineContainer.style.width = `${newTotalWidth}px`;
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
});

// Optional: Add touch/swipe support for mobile
let touchStartX = 0;
let touchStartY = 0;

timelineWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

timelineWrapper.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Only handle horizontal swipes (more horizontal than vertical)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        const scrollTrigger = horizontalScroll.scrollTrigger;
        const progress = scrollTrigger.progress;
        const totalProgress = scrollTrigger.end - scrollTrigger.start;
        
        if (diffX > 0) {
            // Swipe left - go right in timeline
            const newProgress = Math.min(1, progress + (200 / totalProgress));
            scrollTrigger.scroll(scrollTrigger.start + (newProgress * totalProgress));
        } else {
            // Swipe right - go left in timeline
            const newProgress = Math.max(0, progress - (200 / totalProgress));
            scrollTrigger.scroll(scrollTrigger.start + (newProgress * totalProgress));
        }
    }
});

