(function ($) {
 //Array of values to be displayed by default
	var books=[
	    { name: "few things left unsaid", author: "sudeep nagatkar", status: "Unread"},
      	{ name: "life is what we make it", author: "preethi senoy", status: "Read"},
	  	{ name: "read others mind", author: "leinman", status: "Read"}
     ];

//Creation a Book model
   var Book = Backbone.Model.extend({
     		  	defaults: {
				name: "",
            	author: "",
            	status: ""
						   }
									});

//Creation of Library Collection which will hold all books
	var Library = Backbone.Collection.extend({
      	model: Book
    										});
	
//BookView--How a Book Details as to be Presented
    var BookView = Backbone.View.extend({
        tagName: "book",
        className: "book-container",
        template: _.template($("#bookTemplate").html()),
        editTemplate: _.template($("#bookEditTemplate").html()),

        render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
        					},

        events: {
            "click button.delete": "deleteBook",
            "click button.edit": "editBook",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"
        		},

        deleteBook: function () {
            this.model.destroy();
            this.remove();
        						},

        editBook: function () {
            this.$el.html(this.editTemplate(this.model.toJSON()));
							  },

        saveEdits: function (e) {
            e.preventDefault();
            var data = {},
            prev = this.model.previousAttributes();
			data["name"]=$("#editBook #name").val();
			data["author"]=$("#editBook #author").val();
			data["status"]=$("#editBook #editSelect").val();
            this.model.set(data);
            this.render();
					           },

        cancelEdit: function () {
            this.render();
        						}
    });

//LibraryView--How a Library as to be Presented	
    var LibraryView = Backbone.View.extend({
        	el: $("#books"),
      
        	initialize: function () {
		   	this.collection = new Library(books);
		  	this.render();
          	this.collection.on("reset", this.render, this);
          	this.collection.on("add", this.renderBook, this);
               						},

		render: function () {
		  this.$el.find("book").remove();
		  this.input=this.$('.search');
           _.each(this.collection.models, function (item) {
                this.renderBook(item);
            											  }, this);
        					},
       
		renderBook: function (item) {
            var bookview = new BookView({
                model: item
            							});
			this.$el.append(bookview.render().el);
							        },

        events: {
            "keypress .search": "updateOnEnter",
            "click #add": "addBook",
            "click .addition": "showForm"
        		},

        updateOnEnter: function(e){
        	if(e.which == 13){
        	this.close();
								}
									},
  		close: function(){
        	this.filterValue = this.input.val().trim();
	        if(this.filterValue) {
			this.filter();
        						}
     					 },
       
        filter: function () {
			
			this.collection.reset(books, { silent: true });
             var filterValue = this.filterValue.toLowerCase();
             filtered = _.filter(this.collection.models, function (item) {
															   
             return item.get("name").toLowerCase() === filterValue;
             											     });
			
             this.collection.reset(filtered);
			 booksRouter.navigate("book/"+filterValue);	
			 this.input.val("");
             		        },

        addBook: function (e) {
		    e.preventDefault();
            var data = {};
			data["name"]=$("#addBook #name").val();
			data["author"]=$("#addBook #author").val();
			data["status"]=$("#addBook #select").val();
			books.push(data);
            this.collection.add(new Book(data));
			$("#addBook #name").val("");
			$("#addBook #author").val("");
						
        					  },

        showForm: function () {
            this.$el.find("#addBook").slideToggle();
        }
    });
	
	//add routing
   var BooksRouter = Backbone.Router.extend({
         routes: {
            "book/:name": "urlFilter"
        },

        urlFilter: function (name) {
            library.filterValue = name;
            library.filter();
        }
    });
	
 	var library = new LibraryView();
    var booksRouter = new BooksRouter();
    Backbone.history.start();

} (jQuery));


