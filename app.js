const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const prompt = require("prompt-sync")();
const username = prompt("What is your name? ");
const Customer = require('./models/customer.js');


const main = async () => {
	// define the functions
	const connect = async () => {
		await mongoose.connect(process.env.MONGODB_URI);
	};

	const disconnect = async () => {
		await mongoose.disconnect();
		console.log("exiting...");
		process.exit();
	};


	await connect();
	console.log(`Welcome to your favorite CRM! ${username}\n`);

    const welcome = () => {
        console.log(`What would you like to do?
    
        1. Create a customer
        2. View all customers
        3. Update a customer
        4. Delete a customer
        5. quit
        `);
    
        const response = prompt('Number of action to run:');
        console.log(response);
        return response;
    };

    const createCustomer = async () => {
       const name = prompt('What is the New Customer Name? ');
       const age = prompt('How Old is the new Customer? ');

       const customer = await Customer.create({
        name,
        age: parseInt(age),
       });
       console.log('You created:', customer);
    };

    const viewCustomers = async () => {
        const customers = await Customer.find({});
        console.log("Below is a list of your customers: ");
        customers.forEach((customer) => {
            console.log(`id:--${customer.id}, Name: ${customer.name}, Age: ${customer.age}`);
        })
    };

    const updateCustomer = async () => {
        console.log('Below is a list of your customers: ');
        await viewCustomers();
        const id = prompt('Copy and paste the id of the customer you would like to update here:');
        console.log('You selected:', id);
        const name = prompt("What is the customers new name? ");
        const age = prompt("What is the customers new age? ");

        const customer = await Customer.findByIdAndUpdate(id , {name, age}, {new: true});
        console.log("Updated user:", customer);
    };

    const deleteCustomer = async () => {
        console.log('Here is a list of your customers');
        await viewCustomers();
        const id = prompt('Copy and paste the id of the customer you would like to update here:');
        console.log('You selected:', id);
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        console.log("Deleted customer:", deletedCustomer);
    };

    while (true) {
    const answer = welcome();
    if (answer === '1') await createCustomer();
    if (answer === '2') await viewCustomers();
    if (answer === '3') await updateCustomer();
    if (answer === '4') await deleteCustomer();
    if (answer === '5') await disconnect();
    };
};

main();
