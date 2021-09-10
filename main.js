let index = 1;
const products = [
    {id: index++, nom: "Tofu", prix: 5, image: "placeholder.jpg"},
    {id: index++, nom: "Café", prix: 2, image: "placeholder_2.jpg"},
    {id: index++, nom: "Bonbons", prix: 4, image: "placeholder_3.jpg"},
    {id: index++, nom: "Chips", prix: 3, image: "placeholder_2.jpg"},
    {id: index++, nom: "Alcool", prix: 7, image: "placeholder.jpg"},
];

const content = document.querySelector("#content");
const btnShop = document.querySelector(".btnShop");
const btnCart = document.querySelector(".btnCart");
const panier = []

showShop();

btnShop.addEventListener("click", showShop);
btnCart.addEventListener("click", showCart);

function showShop(){
    placeCards(content, generateCards(products));

    const ajoutSections = document.querySelectorAll(".productAdd");
    
    ajoutSections.forEach(section => {
        const counter = section.querySelector(".count");
        const button = section.querySelector(".buttonAdd");

        section.querySelector(".moins").addEventListener("click", () => {subtract(counter, button)});
        section.querySelector(".plus").addEventListener("click", () => {add(counter, button)});
        button.addEventListener("click", (e) => {
            addToCart(parseInt(e.target.id),parseInt(counter.value));
            counter.value = 1;
            showCount();
            section.classList.add("bg-warning");
        });
    });
}

function createCard(product){
    let cardTemplate = `
    <div class="col-4 p-4">
        <div class="card " style="width: 18rem;">
            <img class="card-img-top" src="images/${product.image}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title text-center">${product.nom}</h5>
                    <div class="row">
                        <p class="card-text">${product.prix} €</p>
                        <div class="productAdd">
                            <button class="btn btn-secondary moins"><strong>-</strong></button>
                            <input type="text" class="count" value="1">
                            <button class="btn btn-secondary plus"><strong>+</strong></button>
                            <a id="${product.id}" class="btn btn-success buttonAdd">Add to cart</a>
                        </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return cardTemplate;
}

function generateCards(list){
    let cards = "";
    list.forEach(card => {
        cards += createCard(card);
    })
    return cards;
}

function placeCards(area, cards){
    area.innerHTML = cards;
}

function addToCart(idProduct, quantityProduct){
    let item = {id: idProduct, quantity: quantityProduct};

    let itemFound = panier.find(product => product.id === idProduct)
    if (itemFound) itemFound.quantity += quantityProduct;
    else panier.push(item);
}

function removeFromCart(id){
    let item = panier.find(product => product.id == id)
    
    panier.splice(panier.indexOf(item),1);
    
    showCart();
    showCount();
}

function showCart()
{
    let total = 0;
    let tableItems = ""

    panier.forEach(product =>{
        let item = products.find(p => p.id === product.id)
        total += product.quantity * item.prix;
        tableItems += `
                        <tr>
                            <td>${item.nom}</td>
                            <td>${item.prix} €</td>
                            <td class="quantite" data-article="${product.id}">
                                <button class="btn btn-secondary moins"><strong>-</strong></button>
                                ${product.quantity}
                                <button class="btn btn-secondary plus"><strong>+</strong></button>
                            </td>
                            <td>${product.quantity * item.prix} €</td>
                            <td><button id="deleteBtn${item.id}" class="btn btn-danger deleteBtn"><strong>X</strong></button></td>
                        </tr>
                    `
    })

    let table = `
                <table class="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Sous-total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableItems}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td><strong>Total :</strong></td>
                            <td>${total} €</td>
                            <td><button class="btn btn-success">Payer</button></td>
                        </tr>
                    </tfoot>
                </table>
                `
    content.innerHTML = table;

    const deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click",() => {
            let id = btn.id.charAt(btn.id.length - 1);
            removeFromCart(id);
        })
    });

    const tdsQuantite = document.querySelectorAll(".quantite");
    tdsQuantite.forEach(td => {
        let idProduct = td.getAttribute("data-article");

        td.querySelector(".moins").addEventListener("click",() => {cartSubstract(idProduct)});
        td.querySelector(".plus").addEventListener("click",() => {cartAdd(idProduct)});;

    })
}

function cartAdd(idProduct){
    let item = panier.findIndex(product => product.id == idProduct)
    panier[item].quantity++;
    showCart();
    showCount();
}

function cartSubstract(idProduct){
    let item = panier.findIndex(product => product.id == idProduct)
    
    if(panier[item].quantity > 1){ 
        panier[item].quantity--;
        showCart();
    }
    else removeFromCart(panier[item].id);

    showCount();
}

function add(count, button){
    count.value++;

    if(count.value > 0) button.classList.remove("disabled");
}

function subtract(count, button){
    if(count.value > 0) count.value--;

    if(count.value == 0) button.classList.add("disabled");
}

function showCount(){
    let count = 0;
    panier.forEach(product => count += product.quantity);

    document.querySelector("#count").textContent = count;
}