var current = Object.prototype.valueOf

Object.prototype.valueOf = function () {
    if (this.hasOwnProperty('--prop-value')) {
        return this['--prop-value']
    } else {
        return current.apply(this, arguments)
    }
}
console.log(Object.prototype.valueOf.call({ 'sss': 'ara' }))

var Person = function(name) {
    this.name = name;
    this.canTalk = true;
  };
  
  Person.prototype.greet = function() {
    if (this.canTalk) {
      console.log('Hi, I am ' + this.name);
    }
  };
  
  var Employee = function(name, title) {
    Person.call(this, name);
    this.title = title;
  };
  console.log(Person.prototype)
  Employee.prototype = Object.create(Person.prototype);
  Employee.prototype.constructor = Employee; //If you don't set Object.prototype.constructor to Employee,
                                             //it will take prototype.constructor of Person (parent).
                                             //To avoid that, we set the prototype.constructor to Employee (child).
  
  Employee.prototype.greet = function() {
    if (this.canTalk) {
      console.log('Hi, I am ' + this.name + ', the ' + this.title);
    }
  };
  
  var Customer = function(name) {
    Person.call(this, name);
  };
  
  Customer.prototype = Object.create(Person.prototype);
  Customer.prototype.constructor = Customer; //If you don't set Object.prototype.constructor to Customer,
                                             //it will take prototype.constructor of Person (parent).
                                             //To avoid that, we set the prototype.constructor to Customer (child).
  
  var Mime = function(name) {
    Person.call(this, name);
    this.canTalk = false;
  };
  
  Mime.prototype = Object.create(Person.prototype);
  Mime.prototype.constructor = Mime; //If you don't set Object.prototype.constructor to Mime,
                                     //it will take prototype.constructor of Person (parent).
                                     //To avoid that, we set the prototype.constructor to Mime (child).
  
  var bob = new Employee('Bob', 'Builder');
  var joe = new Customer('Joe');
  var rg = new Employee('Red Green', 'Handyman');
  var mike = new Customer('Mike');
  var mime = new Mime('Mime');
  
  bob.greet();
  // Hi, I am Bob, the Builder
  
  joe.greet();
  // Hi, I am Joe
  
  rg.greet();
  // Hi, I am Red Green, the Handyman
  
  mike.greet();
  // Hi, I am Mike
  
  mime.greet();
  

