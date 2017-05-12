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

operatorStack = [];
redoStack = [];

class Home(webapp2.RequestHandler):
    def get(self):
        page = jinjaTemplate.get_template('/HTML/index.html');
        values = {};
        
        self.response.write(page.render(values));
    
    def post(self):
        pass;
        #   Don't be confused, these are keys, not indicies. The
        #   actual index is + 2 of the key. The first index is the 
        #   name of the function, which will be used as the value 
        #   for the function map, and the second one is used for 
        #   the "argc"
        
        #print(self.request.get("evt"));
        
        #for i in range(int(self.request.get("argc"))):
        #    print(self.request.get(str(i)))
        
        data = self.request.body
        vals = json.loads(data)
        print(vals)
        
app = webapp2.WSGIApplication([
    ('/', Home)
    ])
    