document.addEventListener('DOMContentLoaded', () => {

    const productsBtn = document.querySelectorAll('.add-btn');
    const cartProductsList = document.querySelector('.cart-content__list');
    const cart = document.querySelector('.cart-item');
    const cartQuantity = document.querySelector('.cart-quantity');
    const fullPrice = document.querySelector('.fullprice');
    const orderModalList = document.querySelector('.order-modal__list');

    let price = 0;
    let randomId = 0;

    let size = "";

    let productArray = [];

    const priceWithoutSpaces = (str) => {
        return str.replace(/\s/g, '');
    };

    const normalPrice = (str) => {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    };

    const plusFullPrice = (currentPrice) => {
        return price += currentPrice;
    };

    const minusFullPrice = (currentPrice) => {
        return price -= currentPrice;
    };

    const printFullPrice = () => {
        fullPrice.textContent = `${normalPrice(price)} $`;
    };

    const printQuantity = () => {
        let length = cartProductsList.querySelector('.simplebar-content').children.length;
        cartQuantity.textContent = length;
    };

    const deleteProducts = (productParent) => {
        
        let id = productParent.querySelector('.cart-product').dataset.id;
        let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent));
        minusFullPrice(currentPrice);
        printFullPrice();
        productParent.remove();

        printQuantity();

        updateStorage();

    };

    cartProductsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-product__delete')) {
            deleteProducts(e.target.closest('.cart-content__item'));
            location.reload();
        }
    })

    const sizeButtons = document.querySelectorAll('.size-btn__big, .size-btn__bigger');

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            size = button.textContent;
            const addToCartButton = document.querySelector('.add-btn');
            addToCartButton.textContent = `(${size})`;
        });
    });

    const generateCartProduct = (img, title, price, id, size) => {
        return `
        
        <li class="cart-content__item">
            <article class="cart-content__product cart-product" data-id="${id}">
                <img src="${img}" alt="HOODIE" class="cart-product__img">
                <div class="cart-product__text">
                    <h3 class="cart-product__title">${title}</h3>
                    <span class="cart-product__size" data-ua="Розмір:" data-en="Size:">Розмір: ${size}</span>
                    <span class="cart-product__price">${normalPrice(price)} $</span>
                </div>
                <button class="cart-product__delete"></button>
            </article>
        </li>
        
        `;
    }

    productsBtn.forEach(el => {

        el.closest('.page-grid').setAttribute('data-id', randomId++);
        el.addEventListener('click', (e) => {
            if (!size) {
                alert('Будь ласка, спочатку виберіть розмір. Please select the size first.');
                return;
            }
            let self = e.currentTarget;
            let parent = self.closest('.page-grid');
            let id = parent.dataset.id;
            let img = parent.querySelector('.large-image').getAttribute('src');
            let title = parent.querySelector('.title').textContent;
            let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.price').textContent));

            plusFullPrice(priceNumber);
            printFullPrice();
            cartProductsList.querySelector('.simplebar-content').insertAdjacentHTML('afterbegin', generateCartProduct(img, title, priceNumber, id, size));
            printQuantity();

            size = "";
            const addToCartButton = document.querySelector('.add-btn');
            addToCartButton.innerHTML = '&#x2713;';

            updateStorage();

        });
    });

    const countSumm = () => {
        document.querySelectorAll('.cart-content__item').forEach(el => {
            price += parseInt(priceWithoutSpaces(el.querySelector('.cart-product__price').textContent));
        });
    };

    const initialState = () => {
        const simplebarContent = cartProductsList.querySelector('.simplebar-content');
        if (simplebarContent) {
            simplebarContent.innerHTML = localStorage.getItem('products');
            printQuantity();
            countSumm();
            printFullPrice();
        }
    };

    initialState();

    const updateStorage = () => {
        let parent = cartProductsList.querySelector('.simplebar-content');
        let html = parent.innerHTML;
        html = html.trim();
        if (html.length) {
            localStorage.setItem('products', html);
        } else {
            localStorage.removeItem('products');
        }
    };

    const generateModalProduct = (img, title, price, id, size) => {
        return `

        <li class="order-modal__item">
            <article class="order-modal__product order-product" data-id="${id}">
                <img src="${img}" alt="image" class="order-product__img">
                <div class="order-modal__text">
                    <h3 class="order-product__title">${title}</h3>
                    <span class="order-product__size" data-ua="Розмір:" data-en="Size:">${size}</span>
                    <span class="order-product__price">${normalPrice(price)}</span>
                </div>
                <button class="order-product__delete"></button>
            </article>
        </li>
        
        `;
    }

    const modal = new GraphModal({
        isOpen: (modal) => {
            let array = cartProductsList.querySelector('.simplebar-content').children;
            let fullprice = fullPrice.textContent;
            let length = array.length;

            document.querySelector('.order-modal__quantity span').textContent = `${length}`;
            document.querySelector('.order-modal__summ span').textContent = `${fullprice}`;

            for (item of array) {
                let id = item.querySelector('.cart-product').dataset.id;
                let img = item.querySelector('.cart-product__img').getAttribute('src');
                let title = item.querySelector('.cart-product__title').textContent;
                let priceNumber = item.querySelector('.cart-product__price').textContent;
                let size = item.querySelector('.cart-product__size').textContent;

                orderModalList.insertAdjacentHTML('afterbegin', generateModalProduct(img, title, priceNumber, id, size));

                let obj = {};
                obj.size = size;
                obj.title = title;
                obj.price = priceNumber;
                obj.length = length;
                productArray.push(obj);

            }
        },
        isClose: () => {

        }
    });

    function updateModalValues() {
        const orderModalQuantity = document.querySelector('.order-modal__quantity span');
        const orderModalSumm = document.querySelector('.order-modal__summ span');
        
        if (orderModalQuantity && orderModalSumm) {
            const array = cartProductsList.querySelector('.simplebar-content').children;
            let fullprice = fullPrice.textContent;
            let length = array.length;
        
            for (let i = 0; i < array.length; i++) {
                const item = array[i];
                const priceElement = item.querySelector('.order-product__price');
                if (priceElement) {
                    const priceText = priceElement.textContent;
                    const priceValue = parseInt(priceWithoutSpaces(priceText));
                    fullprice += priceValue;
                }
            }
        
            orderModalQuantity.textContent = `${length}`;
            orderModalSumm.textContent = `${normalPrice(fullprice)}`;
        }
    }

    document.querySelector('.modal').addEventListener('click', (e) => {
        if (e.target.classList.contains('order-product__delete')) {
            let cartProduct = document.querySelector('.cart-content__product').closest('.cart-content__item');
            deleteProducts(cartProduct);
            e.target.closest('.order-modal__product').remove();

            let modalOrderList = document.querySelector('.order-modal__list');

            updateModalValues(modalOrderList);

            updateTotalPrice();

            location.reload();

        }
    });




    const countryInput = document.getElementById('country-input');
    const countryList = document.getElementById('country-list');
    const deliveryService = document.getElementById('delivery-service');
    const orderShipp = document.querySelector('.order-shipp');
    const orderShippText = document.querySelector('.order-modal__text-shipp');
    const orderModalSumm = document.querySelector('.order-modal__summ span');
    const totalElement = document.querySelector('.total');


    const сountriesNovaPoshta = [
        { name: 'Ukraine', price: 3 },
        { name: 'Austria', price: 61 },
        { name: 'Belgium', price: 41 },
        { name: 'Bulgaria', price: 39 },
        { name: 'United Kingdom', price: 94 },
        { name: 'Denmark', price: 41 },
        { name: 'Estonia', price: 16 },
        { name: 'Ireland', price: 41 },
        { name: 'Spain', price: 41 },
        { name: 'Italy', price: 41 },
        { name: 'Latvia', price: 16 },
        { name: 'Lithuania', price: 16 },
        { name: 'Moldova', price: 12 },
        { name: 'Netherlands', price: 47 },
        { name: 'Germany', price: 16 },
        { name: 'Norway', price: 94 },
        { name: 'Poland', price: 15 },
        { name: 'Portugal', price: 47 },
        { name: 'Romania', price: 19 },
        { name: 'Finland', price: 41 },
        { name: 'France', price: 41 },
        { name: 'Croatia', price: 41 },
        { name: 'Czech Republic', price: 16 },
        { name: 'Switzerland', price: 94 },
        { name: 'Sweden', price: 47 },
        { name: 'Canada', price: 128 },
        { name: 'United States', price: 61 }
    ];

    const сountriesUkrPoshta = [
        { name: 'Ukraine', price: 3 },
        { name: 'Austria', price: 18 },
        { name: 'Belgium', price: 18 },
        { name: 'Bulgaria', price: 15 },
        { name: 'United Kingdom', price: 23 },
        { name: 'Denmark', price: 23 },
        { name: 'Estonia', price: 12 },
        { name: 'Ireland', price: 18 },
        { name: 'Spain', price: 18 },
        { name: 'Italy', price: 19 },
        { name: 'Latvia', price: 11 },
        { name: 'Lithuania', price: 10 },
        { name: 'Moldova', price: 13 },
        { name: 'Netherlands', price: 19 },
        { name: 'Germany', price: 13 },
        { name: 'Norway', price: 22 },
        { name: 'Poland', price: 15 },
        { name: 'Portugal', price: 20 },
        { name: 'Romania', price: 15 },
        { name: 'Finland', price: 18 },
        { name: 'France', price: 19 },
        { name: 'Croatia', price: 20 },
        { name: 'Czech Republic', price: 15 },
        { name: 'Switzerland', price: 19 },
        { name: 'Sweden', price: 23 },
        { name: 'Canada', price: 23 },
        { name: 'United States', price: 25 }
    ];

    countryInput.addEventListener('click', function () {
        countryList.style.display = 'block';
        countryList.innerHTML = '';
    
        сountriesNovaPoshta.forEach(function (country) {
            const listItem = document.createElement('li');
            listItem.textContent = country.name;
            countryList.appendChild(listItem);
    
            listItem.addEventListener('click', function () {
                countryInput.value = country.name;
                countryList.style.display = 'none';
                updateTotalPrice();
            });
        });
    });

    document.addEventListener('click', function (e) {
        if (!countryInput.contains(e.target) && !countryList.contains(e.target)) {
            countryList.style.display = 'none';
        }
    });

    deliveryService.addEventListener('change', function () {
        const selectedService = deliveryService.value;
        orderShippText.textContent = `Доставка: ${selectedService}`;
        updateTotalPrice();
    });

    function updateTotalPrice() {

        const selectedService = deliveryService.value;
        let selectedCountries = [];
        let totalPrice = 0;

        if (selectedService === 'Nova-Poshta') {
            selectedCountries = сountriesNovaPoshta;
        } else if (selectedService === 'Ukrposhta') {
            selectedCountries = сountriesUkrPoshta;
        }

        const selectedCountry = countryInput.value;
        const selectedCountryData = selectedCountries.find(country => country.name === selectedCountry);
        const deliveryPrice = selectedCountryData ? selectedCountryData.price : 0;

        orderShipp.textContent = `${deliveryPrice} $`;

        const orderModalSummValue = parseInt(orderModalSumm.textContent);
        totalPrice = orderModalSummValue + deliveryPrice;
        totalElement.textContent = `${totalPrice} $`;
    }






    const TOKEN = "6802131302:AAF7uXdk6cmeNv4BJLVL0tn3xJU8OBijbDM";
    const CHAT_ID = "-1002045640345";
    const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    function gatherFormData() {
        const firstNameElement = document.getElementById('first_name');
        const lastNameElement = document.getElementById('last_name');
        const phoneElement = document.getElementById('phone');
        const emailElement = document.getElementById('email');
        const countryElement = document.getElementById('country-input');
        const regionElement = document.getElementById('region');
        const cityElement = document.getElementById('city');
        const branchElement = document.getElementById('branch');
        const addressElement = document.querySelector('input[name="address"]');
        const notesElement = document.getElementById('myTextarea');
        const deliveryServiceElement = document.getElementById('delivery-service');
    
        const Імя = firstNameElement ? firstNameElement.value : '';
        const Прізвище = lastNameElement ? lastNameElement.value : '';
        const НомерТелефон = phoneElement ? phoneElement.value : '';
        const ЕлектроннаПошта = emailElement ? emailElement.value : '';
        const Країна = countryElement ? countryElement.value : '';
        const ОбластьОкруг = regionElement ? regionElement.value : '';
        const МістоДоставки = cityElement ? cityElement.value : '';
        const НомерВідділенняІндексПошти = branchElement ? branchElement.value : '';
        const НазваВулиці = addressElement ? addressElement.value : '';
        const КоментарДоЗамовлення = notesElement ? notesElement.value : '';
        const Доставка = deliveryServiceElement ? deliveryServiceElement.value : '';
    
        return {
            Імя,
            Прізвище,
            НомерТелефон,
            ЕлектроннаПошта,
            Країна,
            Доставка,
            ОбластьОкруг,
            МістоДоставки,
            НомерВідділенняІндексПошти,
            НазваВулиці,
            КоментарДоЗамовлення
        };
    }
    
    const confirmButton = document.querySelector('.config-btn');
    confirmButton.addEventListener('click', handleOrderConfirmation);

    function handleOrderConfirmation() {
        const formData = gatherFormData();
        const products = productArray.map(product => {
            return {
                size: product.size,
                title: product.title,
                price: product.price,
            };
        });
        let message = `<b>Замовлення з сайту!</b>\n`;

        for (const key in formData) {
            if (formData[key]) {
                message += `<b>${key}: </b>${formData[key]}\n`;
            }
        }

        products.forEach((product, index) => {
            message += `<b>Товар ${index + 1}:</b>\n`;
            message += `<b>Назва: </b>${product.title}\n`;
            message += `<b>Розмір: </b>${product.size}\n`;
            message += `<b>Ціна: </b>${product.price}\n`;
        });

        axios.post(URI_API, {
            chat_id: CHAT_ID,
            parse_mode: 'html',
            text: message
        })
        .then(response => {
            console.log('Повідомлення успішно відправлено до Telegram!', response);
            clearCart();
            window.location.href = '/thank-you-page.html';
        })
        .catch(error => {
            console.error('Помилка відправки повідомлення до Telegram:', error);
        });
    }

    function clearCart() {
        productArray = [];
        const cartProductsList = document.querySelector('.cart-content__list');

        cartProductsList.innerHTML = ``;
        fullPrice.textContent = '0 $';
        cartQuantity.textContent = '0';
        localStorage.clear();

    }
    

});