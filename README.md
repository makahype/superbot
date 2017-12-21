# superbot
A frontend framework to catalyze maintenance. It does this by:
* standardizing process
* simplifying implementation with a small set of tools



# file organization


1) Handlers: These functions are what are called when an event happens. A click 
event, or a change event or any of the dom events you wish to observe should all
have their functions listeners stored together. The "_h" object supplies the 
methods that allow the programmer to bind functions to events. 

2) Business: These functions are your unique frontend business logic. This will
contain any unique data formatting for your logic and/or special animations. 
There is no "_b" object in the framework because this area of application functions
is completely unique to the application. The framework has no idea about what helper
functions might be needed for your set of business logic. Further more the functions
that make up your business logic should be tailored to your use case to make sure
they are optimal. 

3) Senders: Senders are functions that send data to a location. The "_s" object holds
functions to send data to the server via an ajax function or to the dom to render
markup. These functions typically return a defered object in case the result needs
to cascade (be sent to ) other functions. There is a special object in the framework, 
the "frmUT" object has methods for sending and retrieving data from forms.

4) Managers: The "_m" object contains functions that generally helpful to any application.
Functions to manage url history, a function to manage the dom load event, and a
function for name spacing if there is a particular set of data you wish to have global
access to but dont want to pollute the global namespace. These functions may be of little
use to you but the concept of the manager is important. A manager is a function to handle 
the state of the application after all senders have completed. In the manager you bind events
to a dom that is in its final state and set any global values that might be important for
the next event to check after it fires. 





# process organization


By organizing your code into these 4 groups you get some extra 
features from your code:

a) By using the sender functions and the defered function you can ensure the call sequence
 of all the functions that should be involved when an event fires. 

b) Defining a set of managers and handlers gives you a simple representation of the actions you 
raise to the user and the how many different states you have in your application. You might
have multiple events that will converge to a single state. Or you may have multiple 
managers that are called depending on some external state value.

c) You will be able to easily keep track of your application state and ensure that your
 application data will always be logical and predictable. Bugs  can easitly be discovered
 and contained to one of these groups. In most cases your bug should be in the Business Logic
 group because the rest of the HBSM framework should make the rest of your applicaiton
 code automatic.

d) Using this strategy should give you a finite set of deterministic function sequences from
event firing and handler management to data or html sending and state management. This finite
set makes it easier to communicate where bugs occur or how  what new sender and manager
 functions you might need in order to  when implementing a new handler and frontend business
logic.








Diagram Explanation:
=======================

In the root of this repository here is an image,  schema.png. It give a visual representation
of what the implementation scheme should be when using this farmework. Here is a little 
further explination of the diagram:.

1) Start state: These are the initial event binding and url (possible hash) processes
you to when the dom loads. This is where you use the _m.run function and
_h.bind fuction to setup the initial state of your dom. You will
probably also want to compile any templates you plan to use at this time.

2) Process Event: When a event is fired the supplied listener will be called
Now is the time to pass any data to your business logic that relates to this
event. You might have to to use the frmUT object to get data from a form if that
data is to be used for further processing or feature needs.

3) Communicate with server: Once the event data has been gathered you might need
to communicate this event to the server (a search feature perhaps). Here you will
use the _s.ajax or _s.post functions which will return a defered object so 
you can bind other senders to the results.

4) Communicate with DOM: After all data has been gathered for an event and the server
responses have been formatted (and saved if neededd) you will finally send the
data to the dom in the form of html. Here you will use the _s template functions 
which should make data to markup management easy and reduce browser repaints. 

5) Manage new state: After all data has been saved and all markup sent to the dom 
you should now call a manager that handles the finished state of the event. Here you 
might need to rebind events or store a variable to communicate to the rest of
the application what state it is in. This variable can be used to ensure that 
all events fire at a valid moment or state of the application. 










API:
========================
HBSM is make up of 4 global objects. Each object raises a series of methods that
are helpful to the task that the object governs. More detail about these 
different "kinds of tasks"  will be given in the documentation on implementation
strategy. This section only describes what the objects are and what the methods do will.



- _h : Handler object

- _h.bind(event, element, handler): bind a function to run when a particular event
is fired on a particular element

_h.unbind(event, element, handler): remove a function from being run when a 
particular event is fired on a particular element

------

- _s : Sender object

- _s.get(url, data) : send a get request to a url appending the supplied data
(returns utility deferd object)

- _s.post(url, data) : send a post request to a url appending the supplied data
(returns utility deferd object)

- _s.ajax(method, url, data) : send an xmlhttp request to the url appending 
the supplied data and using the given method (returns utility deferd object)

- _s.compileTemplate(ele,save) : parse a template to use for later

- _s.renderTemplate(name, data,ele) : use a already parsed template of the given
name or render data in side a given element. The data is an array of objects in the 
format {name: string, value: string/number}

- _s.renderLoop(name, data,ele) : render a template in an element multiple times
suppling an array of data where each item is a set of data for a single rendering 
of the template

- _s.parseTemplate(name,data) : take the the compiled template name and data and return
the markup string result for applying the data to the template

- _s.appendTemplate(name,data,ele) : render a template markup string for the given
data and append it to the end of the given element


- _s.batchRender(render_funcs) : given an array of functions that alter the dom,
this function will ensure that they are run within the same animation
frame to ensure that browser repainting is kept to a minimum. This function
will return a defered object allow the user to call any other functions after 
all dom manipulations are complete. (uses requestAnimationFrame)

- frmUT : a special sender object for forms

- frmUT.validateFrm(items) : loop through the array of items and check
each is of the correct type, if all inputs are of the correct type then
the function returns true else the function returns false. Any input that
is not of the correct type has a class added to it set from the variable
frmUT.ERRCLS. The items are given in the format {inptid: [id], type: [type]}.

- frmUT.validateInpt(value, type) : valdate a input value is of a certain type

- frmUT.clearFrm(items) : reset all form values


- frmUT.setErr(item) : set the class of the given input item to frmUT.ERRCLS

- frmUT.serializeFrm(items) : given the array of input items turn the form values 
into an object with variable keys mapped to the values. The array of items
supplied to the function should include a "res_lbl" attribute set for each
input item which will determine the key that is mapped to the value in the 
result

- frmUT.populateFrm(data, items) : given a set of data and form input configuration
place the values in the correct input elements

- frmUT.changeSelect(sel, val) : select a particular value given a select box element


[constants]
- _s.TDELIM : the delimeter to use in templates to mark a variable replacement.
Surround a variable name with these delimeters and it will be replaced with the
correct value when the template is rendered ("%t" by default)

- frmUT.ERRCLS : error class for inputs that are invalid

- frmUT.INT : type to validate an input as an integer
- frmUT.STR : type to validate an input as a string
- frmUT.PHN : type to validate an input as a phone number
- frmUT.EMAIL : type to validate an input as an email address
- frmUT.NUM : type to validate an input as a number
-------
    
- _u : the utility object

- _u.defer(start_func) : create a defered object from a given starting function.
This method will allow you to chain  function calls into a sequence. The return 
value from this function is an object that has a method "next" which also takes in
a function and returns a defered object. No function passed to next method will be
called until the previous function as completed and returned with a value that 
is not a defered object. The return value of each function is passed to the next
function in the chain as a parameter.

- _u.queryStr(data) : turn an object into a "GET" method query string

- _u.parseURL(url) : parse the query string from a full url into an array of
 data

- _u.setDomAttr(ele, attrs) : set the given attributes on the given dom element

- _u.getDomAttr(ele,key) : get an element attribute

- _u.addClass(ele, class_str) : add a class to the given dom element

- _u.removeClass(ele, class_str) : remove a class from the given dom element

- _u.eleClass(class_str) : get a list of elements by class name

- _u.eleId(id) : get a dom element by its id attribute

- _u.convertObjToRow(rw_obj) : convert a standard key/value object to 
an object that can be used to supply data to a template

- _u.convertMarkupToNode(html) : create a node object that only includes the 
markup supplied (a document fragment). This is required if you are using the
the template functions to append elements as children to a dom element and not
overriding the entire contents of the dom element


[constants]
_u.DPT : the time in milliseconds between checks to see if a function has completed 
so that a defered object can continue the sequence of functions

------------

- _m : manager object

- _m.setState(name, data) : set a value to a name space in the manager object

- _m.getState(name) : get a value that has been saved in the manager object

- _m.setHistory(url, data) : bind data to a url as a point in the applications 
history

- _m.handleHistory(func) : choose a function to call when handling the history change
event 

- _m.getLocation() : get location data for clients ip using a free service 
(freegeoip.net/json) , returns a deferd object 

- _m.run(custom_func) : supply a function to run on page load


