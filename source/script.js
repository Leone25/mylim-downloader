let working = false;

async function grabTitles() {

    if (working == true) return;

    working = true;
    document.getElementById("working").style.display = "";

    let token = document.getElementById('token').value;

    let info = await fetch('https://www.cloudschooling.it/mialim2/api/v1/book/sommari/', {method: "GET",headers:{"Authorization":"JWT "+token}}).then(res => res.json());

    info.forEach(book => {
        let el = document.createElement('div');
        let img = document.createElement('img');
        img.src = book.opera.copertina;
        img.setAttribute("isbn", book.opera.isbn);
        img.setAttribute("title", book.opera.nome);
        el.innerText = book.opera.isbn + "\n" + book.opera.nome + "\n" + book.opera.autore;
        el.classList.add('book');
        el.setAttribute("isbn", book.opera.isbn);
        el.setAttribute("type", book.tipologia);
        el.setAttribute("title", book.opera.nome);
        el.addEventListener('click', (e)=>{download(e.target.getAttribute('isbn'),e.target.getAttribute('title'))});
        el.appendChild(img);
        document.getElementById("booklist").appendChild(el);
    });

    updateList();

    working = false;
    document.getElementById("working").style.display = "none";
}

function updateList() {
    let searchTherm = document.getElementById("search").value.toUpperCase();
    let demos = document.getElementById("demos").checked;

    document.getElementById("booklist").childNodes.forEach(el => {
        if (el.innerText.toUpperCase().indexOf(searchTherm) > -1) {
            if (demos == true && el.getAttribute('type') == "d") {
                el.style.display = "none";
            } else {
                el.style.display = "";
            }
        } else {
            el.style.display = "none";
        }
    });
}

async function download(isbn, title) {
    if (working == true) return;

    working = true;
    document.getElementById("working").style.display = "";
    
    let token = document.getElementById('token').value;

    let info = await fetch('https://www.cloudschooling.it/mialim2/api/v1/book/pdf/' + isbn + '/', {method: "GET",headers:{"Authorization":"JWT "+token}}).then(res => res.json());
    let book = await fetch(info.url).then(res => res.blob());
    let link = document.createElement("a");
    link.href = URL.createObjectURL(book);;
    link.download = title + ".pdf";
    link.click();
    URL.revokeObjectURL(link.href);

    working = false;
    document.getElementById("working").style.display = "none";
}

document.getElementById("the-button").addEventListener('click', grabTitles);
document.getElementById("search").addEventListener('keyup', updateList);
document.getElementById("demos").addEventListener('change', updateList);
