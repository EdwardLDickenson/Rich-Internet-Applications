import webapp2
import os
import jinja2

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
        print(self.request.get("evt"));
        
        for i in range(int(self.request.get("argc"))):
            print(self.request.get(str(i)))
        
app = webapp2.WSGIApplication([
    ('/', Home)
    ])
    