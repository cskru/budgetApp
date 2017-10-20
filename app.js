/*
* @author Kruthika C S
*/

//Budget Controller

var budgetController = (function () {   //Anonymous function or  Immedietly Invoked Function Expression (iife)
    
    //Fuction construcorts for making lot of objects in future
    var Expenses = function (id, description, value) { 
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expenses.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    Expenses.prototype.getPercentage = function() {
        return this.percentage;  
    };
    
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        
        var sum = 0;
        
        data.allItems[type].forEach(function(current, index, array) {
           sum += current.value; 
        });
        
        data.totals[type] = sum;
        
    };
    //Data Structure to store our data. For object, instead of have variables flowing around
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    
    return {
        addItem: function(type, desc, val) {
            var newItem, ID;
            
            //ID = lastItemID + 1
            //Create ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
            }    
            else {
                ID = 0;
            }
                
            
            //Create new item / object based on 'inc or 'exp'
            if(type === 'exp') {
                newItem = new Expenses(ID, desc, val);
            }
            else if(type === 'inc') {
                newItem = new Income(ID, desc, val);
            }
            
            //Add item to data structure
            data.allItems[type].push(newItem); // Adds new element to the end of the array
            
            //Return new item
            return newItem;
        },
        
        deleteItem: function(type, id) {
            
            var index;
            // id = 3
            ////1 2 4 6 8
            ////0 1 2 3 4
            //If we wanna delete item id 6, index = 3
            
            var ids = data.allItems[type].map(function(current) { //map returns an array
                return current.id;
            });
            
            index = ids.indexOf(id); // WE should delete this item. Here id is a number
            
            if(index !== -1) {
                data.allItems[type].splice(index, 1); //From the given index, remove 1 item
            }
        },
        
        calculateBudget: function() {
         
            // Calculate the total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget = income - expenses
            data.budget = data.totals.inc - data.totals.exp; 
            
            // Caculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
        },
        
        calculatePercentages: function() {
            
            data.allItems['exp'].forEach(function(current) {
               current.calcPercentage(data.totals.inc); 
            });
            
        },
        
        getPercentages: function() {
            
            var allPercentages = data.allItems['exp'].map(function(current) {
                return current.getPercentage();
            });
            return allPercentages;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }  
        },
        
        testing: function() {
            console.log(data);
        }
    }
    
})(); //iife

//UI Controller

var UIController = (function () {
    
    //UI code
    
    //DOMStrings
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        btnAdd: '.add__btn',
        incomeContainer: '.income__list',
        expencesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        totalIncomeLabel: '.budget__income--value',
        totalExpensesLabel: '.budget__expenses--value',
        expPercentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expencesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(type, num) {
            
            var formatedNum, numSplit, int, dec;
            /*Rules*/
            // + or - before the number
            // 2 precision decimal number
            // comma seperate thounds
            
            formatedNum = Math.abs(num);
            formatedNum = formatedNum.toFixed(2); //Returns a string
            
            numSplit = formatedNum.split('.');
            int = numSplit[0];
            dec = numSplit[1];
            
            if(int.length > 3) {
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            
            formatedNum = (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
            return formatedNum;
            
    };
    
    var nodeListForEach = function(list, callback) {
            for(var i = 0; i < list.length; i++) {
                callback(list[i],i);
            }

    }
            
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            
            var html,newHtml,element;
            
            //Create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn">Delete Entry</button> </div> </div> </div>';
            }
            else if(type === 'exp') {
                element = DOMStrings.expencesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn">Delete Entry</button> </div> </div> </div>';
            }
            
            //Replace the placeholders with respective values
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(type, obj.value)); //obj.value
            
            //Add DOM to UI
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            
            el.parentNode.removeChild(el);
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);  //This returns a list, not an array
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                
                current.value = "";
                
            });
            
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj) {
            
            type = obj.budget > 0 ? 'inc' : 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(type, obj.budget);
            document.querySelector(DOMStrings.totalIncomeLabel).textContent = formatNumber('inc', obj.totalInc);
            document.querySelector(DOMStrings.totalExpensesLabel).textContent = formatNumber('exp', obj.totalExp);
            
            // Take care of percentage
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.expPercentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.expPercentageLabel).textContent = '---';
            }
            
        },
        
        displayExpPercentages: function(allPercArr) {
            
            var fields = document.querySelectorAll(DOMStrings.expencesPercentageLabel);
            
            
            nodeListForEach(fields, function(current, index) {
                
                // Take care of percentage
            if(allPercArr[index] > 0) {
                current.textContent = allPercArr[index] + '%';
            } else {
                current.textContent = '---';
            }
             
            });
            
        },
        
        displayMonthAndYear: function() {
            
            var now, year, month, monthInWords;
            monthInWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            now = new Date();
            
            year = now.getFullYear();
            month = now.getMonth();
            
            document.querySelector(DOMStrings.dateLabel).textContent = monthInWords[month] + ' ' + year;  
            
        },
        
        changedType: function () {
          
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            )
            
            nodeListForEach(fields, function(current) {
                
                current.classList.toggle('red-focus')
                
            });
            
            document.querySelector(DOMStrings.btnAdd).classList.toggle('red');
            
        },
        
        getDOMStrings: function() {
            return DOMStrings;
        }
    }
    

})();


//Global App controller

var controller = (function (budgetCtrl, UICtrl) { // Why pass arguements, we can use them directly? - It maked\s modules independent. 
    
    var setupEventListeners = function() {
        
        var DOM = UICtrl.getDOMStrings();
    
        //Add button
        /*document.querySelector('.add__btn').addEventListener('click', function () {

            //Do the same thing as Enter press event handler. So, write a custom function and aall it here
            ctrlAddItem();
        });*/
        document.querySelector(DOM.btnAdd).addEventListener('click', ctrlAddItem); // Using call back

        //Enter press event handler
        document.addEventListener('keypress', function(event) { //KeyboardEvent->UIEvent->Event->Object (prototype chain)
            //console.log(event);

            if(event.keyCode === 13 || event.which === 13) {
                //console.log('ENTER was pressed')
                //Do the same thing as add button. So, write a custom function and all it here
                ctrlAddItem();
            }
        });
        
        // Event Delegation - Deleting items
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItems);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
    };
    
    //Custom functions
    
    var updateBudget = function() {
        
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budgetObj = budgetCtrl.getBudget();
        
        // 3. Display the budget to UI
        //console.log(budgetObj);
        UICtrl.displayBudget(budgetObj);
    };
    
    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from budget controller
        var allPerc = budgetCtrl.getPercentages();
        
        // 3. Update the UI with new percentages
        //console.log(allPerc);
        UICtrl.displayExpPercentages(allPerc);
    }
    
    //Add button and enter press - custom function
    var ctrlAddItem = function () {
        
        var input, newItem;
        
        // 1. Get input field data
        input = UICtrl.getInput();
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            
            // 2. Add the item to budgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to UI
            UICtrl.addListItem(newItem,input.type);

            // 4. Clear fields and set focus on description field
            UICtrl.clearFields();

            // 5. Calculate and update the budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
        
        }

    };
    
    var ctrlDeleteItems = function (event) {
        
        var itemID, splitID, type, ID;
        
        console.log(event.target.parentNode.parentNode.parentNode.id);
        itemID = event.target.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            // Delete item with the itemID
            
            // 1. Ingredients to delete: inc-1 exp-4
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); // This must be a number. to pass into indexOf method
            
            // 2. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 3. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 4. Re-calculate and show the results
            updateBudget();
            
            // 5. Calculate and update percentages
            updatePercentages();
            
        }
        
    };
    
    return {
        init: function() {
            console.log('Application has started..');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayMonthAndYear();
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();