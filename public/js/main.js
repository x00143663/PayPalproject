let paypalClientId;

async function fetchPayPalClientId() {
	  const response = await fetch('/api/paypal-client-id');
	  const data = await response.json();
	  return data.clientId;
}

async function initPayPalButton() {
	  paypalClientId = await fetchPayPalClientId();
	  const script = document.querySelector('script[src="https://www.paypal.com/sdk/js"]');
	  script.setAttribute('src', `https://www.paypal.com/sdk/js?client-id=${paypalClientId}`);

	  script.onload = () => {
		      paypal.Buttons({
			            createOrder: function(data, actions) {
					            const buyerInfo = getBuyerInfo();
					            return fetch('/api/create-paypal-order', {
							              method: 'POST',
							              headers: {
									                  'Content-Type': 'application/json'
									                },
							              body: JSON.stringify({
									                  cart: {
												                total: '100.00'
												              },
									                  buyer: buyerInfo
									                })
							            }).then(function(res) {
									              return res.json();
									            }).then(function(orderData) {
											              return orderData.id;
											            });
					          },
			            onApprove: function(data, actions) {
					            return fetch('/api/capture-paypal-order', {
							              method: 'POST',
							              headers: {
									                  'Content-Type': 'application/json'
									                },
							              body: JSON.stringify({
									                  orderID: data.orderID
									                })
							            }).then(function(res) {
									              return res.json();
									            }).then(function(orderData) {
											              const transactionId = orderData.purchase_units[0].payments.captures[0].id;
											              window.location.href = `/thank-you.html?transactionId=${transactionId}`;
											            });
					          }
			          }).render('#paypal-button-container');
		    };
}

function getBuyerInfo() {
	  return {
		      firstName: document.getElementById('firstName').value,
		      lastName: document.getElementById('lastName').value,
		      email: document.getElementById('email').value,
		      phone: document.getElementById('phone').value,
		      address1: document.getElementById('address1').value,
		      address2: document.getElementById('address2').value,
		      city: document.getElementById('city').value,
		      state: document.getElementById('state').value,
		      zip: document.getElementById('zip').value,
		      country: document.getElementById('country').value
		    };
}

initPayPalButton();


