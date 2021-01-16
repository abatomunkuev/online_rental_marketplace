var animateIntro = document.querySelectorAll('.animateIntro');
var header = document.querySelector('#introHeader');
var search = document.querySelector('.search-bar');
// Animations 

gsap.from([...animateIntro], {
    delay: 0.25,
    y: 16,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.inOut',
    stagger: {
        amount: 0.3
    }
});
var tl = gsap.timeline();
tl.from(header, {
    width:'100%'
});
tl.to(header, {
    background: 'black',
    width: '100%',
    duration: 0.8,
    ease: 'power3.inOut',
});
var controller = new ScrollMagic.Controller();
var scene = new ScrollMagic.Scene({
    triggerElement: ".animateIntro",
    triggerHook: 0,
    reverse: true
}).setTween(tl);
controller.addScene(scene);


// search.addEventListener('submit', (e) => {
//     e.preventDefault();
//     window.location.href = './search'
// });