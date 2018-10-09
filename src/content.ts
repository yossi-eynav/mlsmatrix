declare const chrome;

// setInterval(() => {
//     let results = findResults() || [];
//
//     results = Array.from(results).filter((elm) => {
//         const price = getResultPrice(elm);
//         return price < 59900;
//     });
//
//     results.forEach((e) => {
//         e.style.filter = 'blur(4px)';
//         e.style.opacity = 0.6;
//         e.style.cursor =  'not-allowed';
//     });
//
// }, 5000);
//


function findResults() {
    return document.querySelectorAll('.multiLineDisplay');
}

function getResultPrice(elment) {
    let price = elment.innerText.match(/\$([\d,]+)/);
    if(!price) { return null; }

    return parseInt(price[1].replace(/,/g, ''));
}

function getResultBathrooms(element) {
    return element.innerText.match(/([\d.]+)[ ]?Bathrooms/)
}

function getResultSize(element) {
    const size = element.innerText.match(/([\d.,]+)[ ]?(House Sq Ft|SqFt)/);
    if(!size) { return null; }

    return size[1].replace(/ /g,',');
}

function getResultImagesCount(element) {
    const count = element.querySelector('.count');
    if(!count) { return null; }

    return {
        min: count.innerText.match(/\d*/)[0],
        max: count.innerText.match(/\/ (\d*)/)[1]
    }
}

function getResultBeds(element) {
    const beds = element.innerText.match(/([\d]+)[ ]?Beds/);
    if(!beds) { return null }

    return beds[1];
}