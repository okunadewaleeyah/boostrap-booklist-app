// book class: reps a book
class Book {
    constructor (title, author, bookId) {
        this.title = title
        this.author = author
        this.bookId = bookId
    }
}

// Ui class: handle UI 
class UI {
    static displayBooks() {
        const books = store.getBooks()

// calling addBookToList in the UI because it is responisble
// for adding the books to the table
        books.forEach((book) => UI.addBookToList(book))
    }
// static
    static addBookToList(book) {
        
        const list = document.getElementById('book-list')

        // create the table row element to put into the tbody
        const row = document.createElement('tr')
        row.style.color = 'emerald'
        row.style.fontFamily = 'cursive'

        // add columns
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.bookId}</td>
        <td><a href="" class="btn btn-danger btn-sm delete">X</a></td>
        `
        // append the row to the list
        list.appendChild(row)

    }

    static deleteBook(el) {
        // making sure what is clicked contains the class "delete"
        if(el.classList.contains('delete')) {
            // remove the whole row (the grandparentElement)
            el.parentElement.parentElement.remove()
        }
    }

    
// alerts: handle errors
// message for the actual text
// className to style it- green for sucess, red for danger
    static showAlert(message, className) {
        // build the div and insert it into the UI 
        //cos there's no placehodler for it in the html
        const div = document.createElement('div')
        //add className
        div.className = `alert alert-${className}`
        // adding the text, creating the text using textNode
        div.appendChild(document.createTextNode(message))
        //insertinh
        // grab the parent element i.e the container i.e the container div
        const container= document.querySelector('.container')
        // get the form
        const form = document.getElementById('nook-form')
        // insert the alert
        // take the parent element insert the div before the form
        container.insertBefore(div, form)
        // make the alert popup g0 away after 3secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        // grab each value and clear it
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('bookId').value = ''
    }
}

//store class: local storage 
class store {
    // getbooks
   static  getBooks() {
       let books 
       // check if there is a current book item in local storage
       if (localStorage.getItem('books') === null) {
           // if there is no book in local storage, 
           //set books to an empty array
           books = []
       } else { // if something was found. use json.parse to use as array
           books = JSON.parse(localStorage.getItem('books'))
       }
       return books;
    }

    // addbooks
   static  addBook(book) {
       //get books from local storage
       const books = store.getBooks()
       // push on whatever is passed in addBook(book) as a book
       books.push(book)
       // reset to local storage
       // convert books array to string
       localStorage.setItem('books', JSON.stringify(books))
    }

    // remove books
    static removeBook(bookId) {
        const books = store.getBooks()
        books.forEach((book, index) => {
            // check if the current book being looped through
            //matches the one being removed
            if(book.bookId === bookId) {
                books.splice(index, 1)
            }
        })
        // reset local storage after book has been removed
        localStorage.setItem('books', JSON.stringify(books))
    }
}

//events handlers: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

//event to add book
document.getElementById('book-form').addEventListener('submit', (e) => {
    // prevent actual submit
    e.preventDefault()
    // get form values
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const bookId = document.getElementById('bookId').value


    //form validation
    if(title === '' || author === '' || bookId === '') {
        UI.showAlert('pleaase fill all the boxes!', 'danger')
    } else {
        // instantiate book
    const book = new Book(title, author, bookId);

    // add book to UI
    UI.addBookToList(book)

    // add book to store
    store.addBook(book)

    //show ssuccess message
    UI.showAlert('Book Added!', 'success!')

    // clear input fields after submit
    UI.clearFields()
    }
    
})

// event to remove a book from UI and storage
// targeting the actual list event propagation?
document.getElementById('book-list').addEventListener('click', (e) => {
    // remove book from UI
    e.preventDefault()
    // console.log(e.target
    UI.deleteBook(e.target)
    //remove book from store
    //traversing the DOM
    // previous element sibling
    store.removeBook(e.target.parentElement.previousElementSibling.textContent)
    //show ssuccess message
    UI.showAlert('Book Deleted!', 'success!')
    
})