
    var amount = "{{ grand_total }}"
    var orderID = "{{order.order_number}}"
	var payment_method = 'PayMob'
    var redirect_url = "{% url 'order_complete' %}"
    var url = "{% url 'payments' %}"
    var csrftoken = getCookie('csrftoken');



    const API = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T1RBME1qY3hMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuOW9FOG9GUTI2MFlBdm1yZHNsaDJVcE50dzhIdDFPUU9fUDE3N3UtOUJPb3ZOVnIzZTU4ckVKUWdfVV9nT3Axc1Rna3dleDNoN1JDNVY1ekpjMDJNQWc='        // your api here
    const integrationID = 2627644;

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    async function firstStep () {
        let data = {
            "api_key": API
        }
        
        let request = await fetch('https://accept.paymob.com/api/auth/tokens' , {
            method : 'post',
            headers : {'Content-Type' : 'application/json'} ,
            body : JSON.stringify(data)
        })

        let response = await request.json()
        let token = response.token
        secondStep(token)
    }
    
    async function secondStep (token) {
        let data = {
            "auth_token":  token,
            "delivery_needed": "false",
            "amount_cents": amount * '100',
            "currency": "EGP",
            "items": "{{order}}",
        }
        
        let request = await fetch('https://accept.paymob.com/api/ecommerce/orders' , {
            method : 'post',
            headers : {'Content-Type' : 'application/json'} ,
            body : JSON.stringify(data)
        })
        
        let response = await request.json()
        let orderID = response.orderID
        
        thirdStep(token , orderID)
    }

    async function thirdStep (token , orderID) {
        let data = {
            "auth_token": token,
            "amount_cents":amount * '100', 
            "expiration": 3600, 
            "order_id": orderID,
            "payment_method": payment_method,
            "billing_data": {
                "apartment": "803", 
                "email": "claudette09@exa.com", 
                "floor": "42", 
                "first_name": "Clifford", 
                "street": "Ethan Land", 
                "building": "8028", 
                "phone_number": "+86(8)9135210487", 
                "shipping_method": "PKG", 
                "postal_code": "01898", 
                "city": "Jaskolskiburgh", 
                "country": "CR", 
                "last_name": "Nicolas", 
                "state": "Utah"
            }, 
            "currency": "EGP", 
            "integration_id": '4221279'
        }
        let request = await fetch('https://accept.paymob.com/api/acceptance/payment_keys' , {
            method : 'post',
            headers : {'Content-Type' : 'application/json'} ,
            body : JSON.stringify(data)
        })
         
        let response = await request.json()
        let TheToken = response.token
        cardPayment(TheToken)
    }

    async function cardPayment (token) {
        let iframURL = `https://accept.paymob.com/api/acceptance/iframes/788899?payment_token=${token}`
        location.href = iframURL
    }

    async function cerat_order(data, actions){
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: amount,
                }
            }]
        });
    }

    async function datadb(data, actions){
        return actions.order.capture().then(function(details) {
            // Show a success message to the buyer
            console.log(details);
            sendData();
            function sendData(){
                fetch(url, {
                    method : "POST",
                    headers: {
                        "Content-type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    body: JSON.stringify({
                        orderID: orderID,
                        transID: details.id,
                        payment_method: payment_method,
                        status: details.status,
                    }),
                })
              .then((response) => response.json())
              .then((data) => {
                    window.location.href = redirect_url + '?order_number='+data.order_number+'&payment_id='+data.transID;
                });
            }
        });

    }

    