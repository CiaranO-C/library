let myLibrary = [];
let searchLib = [];

const bookContainer = document.querySelector('.book-container');
const checkbox = document.querySelector('.checkbox');
const toggle = document.querySelector('#circle');
const inputs = document.querySelectorAll('input')
const not = document.querySelector('.not');
const readText = document.querySelector('.read-text');
const submitForm = document.querySelector('.add');
const deleteLibrary = document.querySelector('.delete');
const sort = document.querySelector('#sort');
const filter = document.querySelector('#filter');
const filterContainer = document.querySelector('.filter-container');
const search = document.querySelector('#search');

function updateStorage() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
};

function toggleReadValue (node) {
    myLibrary[findBookIndex(node)].toggleRead();
};

function findBookIndex(node) {
    const book = node.nextElementSibling;
    const bookInfo = book.childNodes;
    let title;
    let author;

    const matching = (elem) => {
        if (elem.title === title) {
            return elem.author === author;
        };
    };

    for (let i = 0; i < 3; i++) {
        if (bookInfo[i].classList.contains('title')) {
            title = bookInfo[i].textContent;
        } else if (bookInfo[i].classList.contains('author')) {
            author = bookInfo[i].textContent;
        };
    };

    const index = myLibrary.findIndex(matching);

    return index;
};


function deleteFromLibrary(node) {
    myLibrary.splice(findBookIndex(node), 1);
};



function bookButtonListener(node) {
    node.childNodes.forEach(child => {
        child.addEventListener('click', () => {
            const index = bookBtnArr.indexOf(node);
            if (child === node.firstChild) {

                deleteFromLibrary(node);

                updateStorage();

                clearDisplay();

                if (isFiltered && isSorted) {
                    sortBooks();
                    filterBooks();
                } else if (isFiltered) {
                    filterBooks();
                } else if (isSorted) {
                    sortBooks();
                };

                displayLibrary();

            } else {
                let text = document.createElement('p');
                text.classList.add('btn-text');
                toggleReadValue(node);
                updateStorage();
                if (child.textContent === 'book_2') {
                    child.textContent = 'auto_stories';
                    text.textContent = 'Not Read';
                } else {
                    child.textContent = 'book_2';
                    text.textContent = 'Read';
                };
                node.appendChild(text);
                setTimeout(() => text.remove(), 2300);
            };
        })
    })
}


search.addEventListener('keyup', () => {
    searchLib = myLibrary.filter(book => {
        return book.title.startsWith(search.value);
    });

    clearDisplay();

    isFiltered = false;
    filter.value = 'placeholder';
    isSorted = false;
    sort.value = 'placeholder';

    while (filterContainer.firstChild) {
        filterContainer.removeChild(filterContainer.firstChild);
    };

    searchLib.forEach(book => displayLibrary(book));
});

function cancelBtnListener(node) {
    node.addEventListener('click', () => {
        node.remove();
        if (node.classList.contains('filter')) {
            filter.value = 'placeholder';
            isFiltered = false;
            clearDisplay();
            displayLibrary();
        } else {
            sort.value = 'placeholder';
            isSorted = false;
            if (isFiltered) {
                filterBooks();
            };
            clearDisplay();
            displayLibrary();
        };
    });
};



let filteredLib = [];
let sortedLib = [];
let isFiltered = false;
let isSorted = false;


filter.addEventListener('change', (e) => {
    const select = e.target;
    const value = select.value;
    const text = select.options[select.selectedIndex].text;

    addBubbleIcon('filter');

    filterBooks();

    clearDisplay();
    displayLibrary();
});

function filterBooks() {
    const value = filter.value;
    isFiltered = true;
    let books = [];
    (isSorted) ? books = sortedLib : books = myLibrary;

    if (value === 'read') {
        filteredLib = books.filter(book => book.read);
    } else if (value === 'not-read') {
        filteredLib = books.filter(book => !book.read);
    } else {
        filteredLib = books.filter(book => book.genre === value);
    };
};

function addBubbleIcon(type) {

    let selectionText = '';

    if (type === 'filter') {
        selectionText = filter.options[filter.selectedIndex].text;
    } else if (type === 'sort') {
        selectionText = sort.options[sort.selectedIndex].text;
    }

    const bubble = document.createElement('button');
    bubble.classList.add('filter-button', `${type}`);

    const btnText = document.createElement('span');
    btnText.textContent = selectionText;

    const icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.textContent = 'close';

    bubble.append(btnText, icon);
    cancelBtnListener(bubble);

    //checks for pre-existing filter/sort icons, replaces if found with new selection
    const elems = Array.from(filterContainer.childNodes);
    let matchFound = false;
    elems.forEach(elem => {
        if (elem.classList.contains(type)) {
            filterContainer.replaceChild(bubble, elem);
            matchFound = true;
        };
    });
    // if not found adds as new icon
    if (!matchFound) filterContainer.appendChild(bubble);
};


function sortBooks() {
    const value = sort.value;
    const text = sort.options[sort.selectedIndex].text;
    sortedLib = myLibrary.slice();
    isSorted = true;

    sortedLib.sort((a, b) => {
        const bookA = a[value];
        const bookB = b[value];

        if (text === 'Ascending') {
            if (bookA < bookB) {
                return -1;
            } else if (bookA > bookB) {
                return 1;
            } else return 0;
        } else {
            if (bookA > bookB) {
                return -1;
            } else if (bookA < bookB) {
                return 1;
            } else return 0;
        };
    });
    console.log(`sorted array: ${sortedLib}`);
};


sort.addEventListener('change', () => {
    //const text = sort.options[sort.selectedIndex].text;
    addBubbleIcon('sort');
    sortBooks(); //sorts entire library every time

    if (isFiltered) {
        filterBooks();
    }
    clearDisplay();
    displayLibrary();
});


deleteLibrary.addEventListener('click', () => {
    localStorage.clear();
    myLibrary.length = 0;
    if (bookContainer.firstChild) {
        clearDisplay();
    } else {
        deleteLibrary.style.backgroundColor = 'rgb(255, 98, 98)';
        setTimeout(() => {
            deleteLibrary.style.backgroundColor = '';
        }, 500);
    };
});


submitForm.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.querySelector('#book-form');

    const formData = new FormData(form);

    const bookValues = Array.from(formData.values());
    const book = new Book(...bookValues);
    console.log(`book = ${book}`);

    storeBook(book);
    displayLibrary(book);
    form.reset();
})

toggle.addEventListener('click', () => {
    if (checkbox.checked) {
        checkbox.checked = false;
        checkbox.style.backgroundColor = '';
        toggle.style.left = '1px';
        not.style.left = '0px';
        not.style.opacity = 1;
        readText.style.right = '0px';
    } else {
        checkbox.checked = true;
        checkbox.style.backgroundColor = 'rgb(127, 241, 133)';
        toggle.style.left = '20px';
        not.style.left = '35px';
        not.style.opacity = 0;
        readText.style.right = '30px';
    };
    console.log(checkbox.checked);
});

inputs.forEach((input) => {
    input.addEventListener('focus', () => {
        const label = document.querySelector(`.${input.id}`);
        label.style.bottom = '20px';
    })

    input.addEventListener('blur', () => {
        const label = document.querySelector(`.${input.id}`);
        if (!input.value) return label.style.bottom = '0px';
    })
})


function Book(title, author, genre, pages, read) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.pages = pages;
    (read) ? this.read = read : this.read = false;

    switch (genre) {
        case 'drama':
            this.genreIcon = 'domino_mask';
            break;

        case 'fiction':
            this.genreIcon = 'waves';
            break;

        case 'sci-fi':
            this.genreIcon = 'rocket';
            break;

        case 'non-fiction':
            this.genreIcon = 'book_2';
            break;

        case 'fantasy':
            this.genreIcon = 'swords';
            break;

        case 'mystery':
            this.genreIcon = 'mystery';
            break;
    };
};

Book.prototype.toggleRead = function () {
    if(this.read === true){
        this.read = false;
    } else {
        this.read = true;
    };
};



function storeBook(book) {
    myLibrary.push(book); //adds book to library array
    updateStorage();
};

//pushes any stored books straight onto library array
function checkStorage() {
    if (localStorage.length) {
        const myLibraryString = localStorage.getItem('myLibrary');
        myLibrary = JSON.parse(myLibraryString);
    };
};



function displayLibrary(book) {
    if (book) {
        addToLibrary(book);
    } else {
        let library = [];
        if (isFiltered) {
            library = filteredLib;
        } else if (isSorted) {
            library = sortedLib;
        } else library = myLibrary;

        for (let i = 0; i < library.length; i++) {
            addToLibrary(library[i])
        }
        console.log('books generated!'); //test
    };
};

function clearDisplay() {
    bookBtnArr.length = 0;
    columnCount = 0;
    while (bookContainer.firstChild) {
        bookContainer.removeChild(bookContainer.firstChild);
    };
    console.log('display cleared!'); //test
};

let columnCount = 0;
const bookBtnArr = [];

function addToLibrary(book) {

    if (columnCount === 4) {
        const line = document.createElement('div')
        line.classList.add('dividing-line');
        bookContainer.appendChild(line);
        columnCount = 0;
    }
    columnCount++;

    const bookButtons = document.createElement('div');
    bookButtons.classList.add('book-buttons-container');

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('book-btn', 'delete-btn', 'material-symbols-outlined');
    deleteBtn.textContent = 'close';

    const readBtn = document.createElement('button');
    readBtn.classList.add('book-btn', 'read-btn', 'material-symbols-outlined');
    (book.read) ? readBtn.textContent = 'book_2' : readBtn.textContent = 'auto_stories';

    bookButtons.append(deleteBtn, readBtn);
    bookBtnArr.push(bookButtons);
    bookButtonListener(bookButtons);

    bookContainer.appendChild(bookButtons);

    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const title = document.createElement('p');
    title.classList.add('title');
    title.textContent = book.title;

    const dividingLine = document.createElement('div');
    dividingLine.classList.add('line');

    const author = document.createElement('p');
    author.classList.add('author')
    author.textContent = book.author;

    const pages = document.createElement('p');
    pages.classList.add('page-number');
    pages.textContent = book.pages;

    const icon = document.createElement('span');
    icon.classList.add('material-symbols-outlined');
    icon.textContent = `${book.genreIcon}`;

    bookCard.append(title, dividingLine, author, dividingLine.cloneNode(true), pages, icon);

    bookContainer.appendChild(bookCard);

    leftPosition = -3;
    topPosition = -2;

    let pageStack = document.createElement('div');
    const numOfPages = Math.ceil((book.pages / 10) / 4.2);


    for (let z = 1; z <= numOfPages; z++) {
        const bookPage = document.createElement('div');
        bookPage.style.position = 'absolute';
        bookPage.style.left = `${leftPosition}px`;
        bookPage.style.top = `${topPosition}px`;
        bookPage.style.zIndex = -z;
        bookPage.classList.add('page');
        pageStack.appendChild(bookPage);
        leftPosition += 2;
        topPosition += 1;
    }


    const backCover = document.createElement('div');
    backCover.style.position = 'absolute';
    backCover.classList.add('book-cover');
    backCover.style.left = `${leftPosition + 6}px`;
    backCover.style.top = `${topPosition + 3}px`;
    backCover.style.zIndex = -numOfPages - 1; //must be one less than page count
    pageStack.appendChild(backCover);

    bookCard.appendChild(pageStack);
};


checkStorage();
displayLibrary();
console.log(myLibrary);
//addToLibrary();

