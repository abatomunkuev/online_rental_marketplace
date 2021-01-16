var button = document.querySelector('#buttonFilter');
var filters = document.querySelector('.filters');
const selectTypePlace = document.querySelector('#typePlace');
const selectSort = document.querySelector('#sortSel');
const filterForm = document.querySelectorAll('#filterID');
function unsetVisibility() {
    gsap.set(filters, {visibility: 'hidden',opacity: 1});
}
button.addEventListener('click', () => {
    var filterMenuOpen = filters.style.visibility == 'hidden';
    if(filterMenuOpen) {
        gsap.from(filters, {
            y: -16,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut'
        });
        gsap.set(filters, {visibility: 'visible'});
    } else {
        gsap.to(filters, {
            y: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.inOut',
            onComplete: unsetVisibility
        });
    }
})
/*
selectTypePlace.addEventListener('change', async (e) => {
    document.forms[1].submit()
    //const text = await response.text();
    //let resp = JSON.parse(text);
    //console.log(resp);
})

selectSort.addEventListener('change', (e) => {
    document.forms[1].submit()
})
*/