let title = document.querySelector(".titleInstructions");
let steps = document.querySelectorAll('.step');


gsap.from([title,...steps], {
    delay: 0.25,
    x: -16,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.inOut',
    stagger: {
        amount: 0.3
    }
})