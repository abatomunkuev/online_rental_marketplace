var introMessages = document.querySelectorAll('.Message');
var menu = document.querySelector('.menu');
var popUpBackground = document.querySelector('.pop-up-background');
var popUpBackgroundDelete = document.querySelector('#pop-up-background-delete')
var popUpMenu = document.querySelector('.pop-up-content');
var deletePopUp = document.querySelector('#deletePopUP');
var htmlBody = document.querySelector('body');
var closePopUp = document.querySelector('#closePopUp');
var closePopUpDelete = document.querySelector('#closePopUpDelete');
const roomEditButton = document.querySelector('#roomEdit');
const roomRemoveButton = document.querySelector('#roomRemove');
gsap.from([...introMessages], {
    delay: 0.5,
    y: 16,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.inOut',
    stagger: {
        amount: 0.3
    }
});

function unsetVisibilityPopUp () {
    gsap.set(popUpMenu, {visibility: 'hidden',opacity: 1});
}
function setVisibilityPopUp () {
    gsap.set(popUpMenu, {visibility: 'visible'});
}

if(closePopUp) {
    closePopUp.addEventListener('click', () => {
        console.log('close clicked');
        var popUpOpen = popUpBackground.style.visibility == 'visible' && popUpMenu.style.visibility == 'visible';
        if(popUpOpen) {
            gsap.to(popUpMenu, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.inOut',
                onComplete: unsetVisibilityPopUp
            });
            gsap.set(popUpBackground, {visibility: 'hidden'});
            htmlBody.style.overflow = 'visible';
        }
    })
}
if(roomEditButton) {
    roomEditButton.addEventListener('click', (e) => {
        console.log(e);
        e.preventDefault();
        console.log('menuLogin clicked!');
        var popUpClosed = popUpBackground.style.visibility == 'hidden' && popUpMenu.style.visibility == 'hidden';
        if(popUpClosed) {
            console.log('here');
            gsap.to(popUpBackground, {
                visibility: 'visible'
            });
            gsap.set(popUpMenu, { visibility: 'visible', opacity: 1});
            gsap.from(popUpMenu, {
                delay: 0.3,
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.inOut'
            })
            htmlBody.style.overflow = 'hidden';
        }
    })
}

function unsetVisibilityPopUpDelete () {
    gsap.set(deletePopUp, {visibility: 'hidden',opacity: 1});
}
function setVisibilityPopUpDelete () {
    gsap.set(deletePopUp, {visibility: 'visible'});
}

if(roomRemoveButton) {
    roomRemoveButton.addEventListener('click', (e) => {
        console.log(e);
        e.preventDefault();
        console.log('menuLogin clicked!');
        var popUpClosed = popUpBackgroundDelete.style.visibility == 'hidden' && deletePopUp.style.visibility == 'hidden';
        if(popUpClosed) {
            console.log('here');
            gsap.to(popUpBackgroundDelete, {
                visibility: 'visible'
            });
            gsap.set(deletePopUp, { visibility: 'visible', opacity: 1});
            gsap.from(deletePopUp, {
                delay: 0.3,
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.inOut'
            })
            htmlBody.style.overflow = 'hidden';
        }
    })
}

if(closePopUpDelete) {
    closePopUpDelete.addEventListener('click', () => {
        console.log('close clicked');
        var popUpOpen = popUpBackgroundDelete.style.visibility == 'visible' && deletePopUp.style.visibility == 'visible';
        if(popUpOpen) {
            gsap.to(deletePopUp, {
                y: 50,
                opacity: 0,
                duration: 0.5,
                ease: 'power3.inOut',
                onComplete: unsetVisibilityPopUpDelete
            });
            gsap.set(popUpBackgroundDelete, {visibility: 'hidden'});
            htmlBody.style.overflow = 'visible';
        }
    })
}