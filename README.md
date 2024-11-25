GTS Take Home Assignment 

Simple PayPal Checkout Web Application

Before working on the solution, recommended to read through the entire request first for better
understanding.

Please develop a web page (it can be simple HTML, UI design is not important as long as the interface is clear) with a backend that meets the following requirements:

1.	A web page to simulate a basic shopping cart page on a web store.
a)	Whether the page looks nice does not matter. However, it must be clear to avoid user confusion.
b)	It shows at least one product with its name, item number and price.
c)	It shows fields with a buyer’s information: her first name, last name, email, phone number and shipping address (address line 1, 2, state or province, zip or postal code, and country). The pre-filled shipping address shall be a valid address in the US. All buyer information shall be editable HTML fields on the page.
d)	Button(s) to initiate a PayPal payment process, at least one of which should be a yellow “PayPal” one. These button(s) shall be rendered by the PayPal JS SDK ( paypal.com/sdk/js )  
2.	Server-side program(s).
a)	The server program(s) shall implement use of a PayPal API that authenticates using oauth2 (client-id and secret keys) to generate an access token (on demand or cached) and make subsequent API calls.
b)	The payment process shall be initiated by the user clicking the button mentioned above, which will call the PayPal API for setup.
c)	The buyer’s pre-filled information shall be passed to PayPal in this setup so that the buyer does not have to input any of her information on PayPal again (although a buyer account with different shipping information might be used for checkout)
d) 	After the payer approves the payment at PayPal and returns, the server shall capture/execute the set-up payment so that a PayPal transaction is created.
3.	A thank-you message or page
a)	After the server creates a successful transaction, a thank you message, or page shall be displayed to the buyer. This should include the transaction ID created for the checkout process.
5.	Make use of PayPal Sandbox testing environment (not live)
Deliverables: 
1.	A working demo hosted on a public cloud service that allows hiring manager to conduct a simple test (we will capture screenshots for documentation purposes)
2.	PayPal sandbox account credentials that can be used for this test.
3.	Link to a GitHub repository containing your code for the demo.

