// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

newQuoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // debugger
    let quote = e.target["new-quote"].value // -
    let author = e.target.author.value //no -
    fetch(`http://localhost:3000/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote,
            author
        })
    })
    .then(res => res.json())
    .then(newQuote => makeAnotherFetch())
})

function makeAnotherFetch(){
    fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(res => res.json())
    .then(allQuotes => {
        createElement(allQuotes[allQuotes.length - 1])
    })
}

function loadData(){
    return fetch(`http://localhost:3000/quotes?_embed=likes`)
    .then(res => res.json())
    .then(quotesData => quotesData.forEach(quote => createElement(quote)))
}

function createElement(quote){
    // console.log(quote)
    // <li class='quote-card'>
    //   <blockquote class="blockquote">
    //     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    //     <footer class="blockquote-footer">Someone famous</footer>
    //     <br>
    //     <button class='btn-success'>Likes: <span>0</span></button>
    //     <button class='btn-danger'>Delete</button>
    //   </blockquote>
    // </li>
    const li = document.createElement("li")
    li.className = "quote-card"
    li.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>`

    let deleteButton = li.querySelector(".btn-danger")
    deleteButton.addEventListener("click", (e) => {
        // debugger
        
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(() => li.remove())
    })

    let likeButton = li.querySelector(".btn-success")
    // console.log(likeButton)
    likeButton.addEventListener("click", (e) => {
        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        })
        .then(res => res.json())
        .then(newLike => {
            let buttonSpan = li.querySelector("button span")
            quote.likes.push(newLike) //updating JS runtime memory 
            // debugger
            buttonSpan.innerText = quote.likes.length
            // buttonSpan.innerText = parseInt(buttonSpan.innerText) + 1 //does not update memory
            // console.log(quote.likes)
        })
    })
    quoteList.append(li)
}


loadData()