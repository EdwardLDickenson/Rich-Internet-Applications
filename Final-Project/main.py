import webapp2
import os
import jinja2
import json

from google.appengine.ext import ndb
from google.appengine.ext import testbed

jinjaTemplate = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
autoescape=True)

#   Going to be the values for/from the undo and redo buttons
operatorStack = [];
redoStack = [];

class evtLocation(ndb.Model):
    x = ndb.IntegerProperty();
    y = ndb.IntegerProperty();

class Operation(ndb.Model):
    url = ndb.TextProperty();
    evt = ndb.StringProperty();
    location = ndb.StructuredProperty(evtLocation, repeated=True);    

class Home(webapp2.RequestHandler):
    def get(self):
        page = jinjaTemplate.get_template('/HTML/index.html');
        #   Not actually passing anything to the page yet, but this might be the way we load the saved image
        values = {};
        
        self.response.write(page.render(values));
    
    def post(self):
       
        data = self.request.body;
        vals = json.loads(data);
        
        if type(vals) is list:
            print("Repeated");
            
        if type(vals) is dict:
            print("Not repeated");
        
        #if vals[0] != "evt":
        #    print("repeated");
        
        #if len(vals) > 5:
        #    print(len(vals));
        #    print(vals);
            
        #print(vals["url"]);
        
        #print(vals)
        #print(len(vals));
        
        #operation = Operation(location=);
        #   Has to be -1 because the last index contains event type 
        #for i in range(len(vals) - 1):
            
         
        #print(vals);
        #operation = Operation(url=vals["url"], evt=vals["evt"]);
        #operation.put();
        
        pass;
        
app = webapp2.WSGIApplication([
    ('/', Home)
    ])
    