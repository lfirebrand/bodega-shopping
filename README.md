# Welcome to Bodega
Bodega is a collaborative shopping app for family and friends.

## Signing Up
Users can sign up using an email address and password. Once signed in, they have access to view, create, edit and delete lists; view, create, edit and delete items; and mark if items have been purchased.

### Lists
Once signed in, users are taken to the Lists page, where they can view existing lists or add a new list. Lists can also be edited or deleted from in the list/edit view.

### Items
When users click on a List they will be taken to the List view, which lists the item name and needed quantities. From this screen, they can add new items. If they click into an individual item, users can update the name, quantity, mark as purchased/not purchased or delete an item.

# Getting started

Clone the repo:
`git clone https://github.com/lfirebrand/bodega-shopping.git`

Install project dependencies:
`cd bodega-shopping && npm install`

# Start the server
`npm run start`

Open http://localhost:3000 to view in your browser.

# Followup

This is a collaborative shopping app with user roles built into the project. I decided to use Node, Express and Sequelize for a lightweight, scalable app. Views are handled by the EJS view engine with styling through Bootstrap, using FontAwesome icons. The main challenge was implementing the purchase featuring using Sequelize. I spent a lot of time digging through the Sequelize documentation to understand how Boolean data types were handled. Ultimately, I decided the best way to implement this feature was through an additional data structure that “belongs” to the Item and User datatypes, rather than tying it directly into the Item itself. If I had more time, I would update the list view to show whether or not an item is purchased (rather than on the item view itself). I’d also add features to allow users to send lists via email or SMS.

# Built with
* Node
* Express
* Sequelize
* Jasmine
* EJS
* Passport
* Bootstrap
