# Superbot
A frontend framework to catalyze maintenance. 


# Source Files
* handler.js : event listening wrappers
* sender.js : templating, http request wrappers
* utility.js : defer function, general dom wrappers
* manager.js : handle page loading and provide namespace to load different states
* glbobj.js : global access object and meta info



# Examples
* test : a simple diagnostic page to check individual functions
* ex1 : an example of a single load script and template parsing
* ex2 : a small dashboard example displaying multiple screens and 
organizing code across different features. In this example you'll notice the
model data separated from the functions which are broken into different screens.



# API
Superbot has 5 objects tied to the "sb" global object.



|   signature   |   return type     |  description     |
|   -----       |   -----           |   -----          |
| sb.h :        |                   |   handler functions, event helpers|
| sb.h.bind(event, element, handler):|   void       | bind a function to run when a particular event is fired on a particular element|
| sb.h.unbind(event, element, handler):|  void           | remove a function from being run when a particular event is fired on a particular element|
| sb.s :        |                   | sender functions  |
| sb.s.get(url, data) :|   defered obj          | send a get request to a url appending the supplied data (returns utility deferd object)|
| sb.s.post(url, data) :|   defered obj            | send a post request to a url appending the supplied data (returns utility deferd object)|
| sb.s.ajax(method, url, data) :|   defered obj        | send an xmlhttp request to the url appending the supplied data and using the given method (returns utility deferd object)|
| sb.s.compileTemplate(ele,save) :|  void        | parse a template to use for later, ele can be an element object or a string id.  The template (the markup inside the element) hold sections to be replace with data values delimited by the values "%t" on either end  ex: <li>%titem_desc%t</li>|
| sb.s.renderTemplate(name, data,ele) :| void       | use a already parsed template of the given name or render data in side a given element. The data is an array of objects in the format {name: string, value: string/number}|
| sb.s.renderLoop(name, data,ele) :|  void   | render a template in an element multiple times suppling an array of data where each item is a set of data for a single rendering  of the template|
| sb.s.parseTemplate(name,data) : |   string     |take the the compiled template name and data and return the markup string result for applying the data to the template. The data is an array of objects in the  format {name: string, value: string/number}|
| sb.s.appendTemplate(name,data,ele) :|   void      | render a template markup string for the given data and append it to the end of the given element|
| sb.s.batchRender(render_funcs) :|    void         | given an array of functions that alter the dom, this function will ensure that they are run within the same animation frame to ensure that browser repainting is kept to a minimum. This function will return a defered object allow the user to call any other functions after  all dom manipulations are complete. (uses requestAnimationFrame)|
| sb.loadTemplate(name, html):|     void            | load a string as a template. This is to be used with precompiled templates to remove the need for adding template markup to the page.|
| sb.displayTemplate(name, data, ele_id):| void         | function is a common use that encapsulates rendering a template into an element give a specific set of data and the elements id|
| sb.displayLoop(name, data_arr, ele_id):| void         |function is a common use that encapsulates rendering a template as a list item into an element give a specific array of data items and the elements id|
| sb.s.TDELIM [constant]:|                  | the delimeter to use in templates to mark a variable replacement. Surround a variable name with these delimeters and it will be replaced with the correct value when the template is rendered ("%t" by default)|
|sb.u :|                    | utility functions|
|sb.u.defer(start_func) :|  {next: func(data)}           | create a defered object from a given starting function. This method will allow you to chain  function calls into a sequence. The return  value from this function is an object that has a method "next" which also takes in a function and returns a defered object. No function passed to next method will be called until the previous function as completed and returned with a value that  is not a defered object. The return value of each function is passed to the next function in the chain as a parameter.|
|sb.u.queryStr(data) :|     string            | turn an object into a "GET" method query string|
|sb.u.parseURL(url) :|      obj            | parse the query string from a full url into an array of data|
|sb.u.setDomAttr(ele, attrs) :| void        | set the given attributes on the given dom element|
|sb.u.getDomAttr(ele,key) :|     string           | get an element attribute|
|sb.u.addClass(ele, class_str) :|  void         | add a class to the given dom element|
|sb.u.removeClass(ele, class_str) :|   void         | remove a class from the given dom element|
|sb.u.eleClass(class_str) :|    [dom elements]  | get a list of elements by class name|
|sb.u.eleId(id) :|      dom element            | get a dom element by its id attribute|
|sb.u.convertObjToRow(rw_obj) :|    obj            | convert a standard key/value object to an object that can be used to supply data to a template|
|sb.u.convertMarkupToNode(html) : |  dom element               |create a node object that only includes the  markup supplied (a document fragment). This is required if you are using the the template functions to append elements as children to a dom element and not overriding the entire contents of the dom element|
|sb.u.DPT [constant]:|              | the time in milliseconds between checks to see if a function has completed  so that a defered object can continue the sequence of functions|
|sb.m : |               |manager functions|
|sb.m.setManager(name, function) :|     void            | store a function to handle a certain state|
|sb.m.manageState(name) :|          void                | call manager function for a given state|
|sb.m.run(custom_func) :|        void                   | supply a function to run on page load (the first state)|
|sb.frm : |               |form utility functions|
|sb.frm.validateInput(value, type) :|     boolean      | validate if a value if of a certain type |
|sb.frm.changeSel(element, value) :|     void            |  change a select box current value |


# Process organization and Diagram Explanation
sborganization.png

1) Start state: These are the initial event binding and url (possible hash) processes
you to when the dom loads. This is where you use the sb.m.run function and
sb.h.bind fuction to setup the initial state of your dom. You will
probably also want to compile any templates you plan to use at this time.

2) Process Event: When a event is fired the supplied listener will be called
Now is the time to pass any data to your business logic that relates to this
event. 

3) Communicate with server: Once the event data has been gathered you might need
to communicate this event to the server (a search feature perhaps). Here you will
use the sb.s.ajax or sb.s.post functions which will return a defered object so 
you can bind other senders to the results.

4) Communicate with DOM: After all data has been gathered for an event and the server
responses have been formatted (and saved if needed) you will finally send the
data to the dom in the form of html. Here you will use the sb.s template functions 
which should make data to markup management easy and reduce browser repaints. 

5) Manage new state: After all data has been saved and all markup sent to the dom 
you should now call a manager that handles the finished state of the event. Here you 
might need to rebind events or store a variable to communicate to the rest of
the application what state it is in. This variable can be used to ensure that 
all events fire at a valid moment or state of the application. 



# Benefits
By using this library to organize your code in synchronous paths you get added
features from your code:

a) ability to control flow and creation of state

b) organize code by what area its responsible (event handles,  ajax and template senders , and state managers) for making it 
easier to maintain

c) your code becomes deterministic, fully testable


## TODOS
* create api page/docs
* add to examples
