var thankMessages = document.querySelectorAll('.thankMessage');

gsap.from([...thankMessages], {
    delay: 0.25,
    y: 16,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.inOut',
    stagger: {
        amount: 0.3
    }
})