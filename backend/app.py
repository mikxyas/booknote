from flask import Flask, jsonify, request,session
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableList
from flask_migrate import Migrate
import uuid
from sqlalchemy.sql import text
from sqlalchemy import MetaData
from flask.views import MethodView
import json
import jwt
import requests
from functools import wraps
from werkzeug.security import check_password_hash, generate_password_hash
from bs4 import BeautifulSoup
from urllib.parse import urlparse
        # to check if a password is correct
        # if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
        #     return apology("invalid username and/or password", 403)
        # to create a new password hash
        #   user_password = generate_password_hash(request.form.get("password"))

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

app = Flask(__name__ ,instance_relative_config=True)
CORS(app)
app.secret_key = "hello"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
app.config['JWT_SECRET_KEY'] = "please-remember-to-change-me"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app, metadata=metadata)
# db.init_app(app)
migrate = Migrate(app, db,render_as_batch=True)

# class CustomJSONEncoder(JSONEncoder):
#   "Add support for serializing timedeltas"

#   def default(o):
#     if type(o) == datetime.timedelta:
#       return str(o)
#     if type(o) == datetime.datetime:
#       return o.isoformat()
#     return super().default(o)

# app.json_encoder = CustomJSONEncoder     


class User(db.Model):
        id = db.Column(db.Text, primary_key=True, default=lambda: str(uuid.uuid4()))
        name = db.Column(db.String(100))
        email = db.Column("email", db.String(100), unique=True)
        password = db.Column(db.Text)
        library = db.relationship('Library', backref='user')
        def __init__(self, name, email, password):
                self.name = name
                self.email = email
                self.password = password
        def __repr__(self):
                return f"<User email={self.email} name={self.name} id={self.id} >"

        def toJSON(self):
                return {"id": self.id, "name":self.name, "email":self.email}


class Library(db.Model):
        id = db.Column(db.Text, primary_key=True, default=lambda: str(uuid.uuid4()))
        children = db.relationship('Block', backref='library')
        creator = db.Column(db.Integer, db.ForeignKey('user.id'))
        name = db.Column(db.Text)
        object = db.Column(db.String(10), default="library")
        type = db.Column(db.String(10), default="library")
        active_shelf = db.Column(db.String(36))       
        def __init__(self, creator, name):
                self.creator = creator
                self.object = "library"
                self.name = name
        def __repr__(self):
                return f"<Library  user_id={self.creator} id={self.id} object={self.object}>" #only testing change later
        def toJSON(self):
                return {"id": self.id, "name":self.name, "creator":self.creator, "object":self.object} #only testing change later



#  THe children and parent columns are only going to be in the block and the library
class Block(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        parent_id =  db.Column(db.Integer, db.ForeignKey("block.id"))
        children = db.relationship("Block", backref=db.backref('Block', remote_side=[id]))
        type = db.Column(db.String(20))
        library_parent = db.Column(db.Integer, db.ForeignKey('library.id'))
        object = db.Column(db.String(10), default="block")

        shelf = db.relationship('Shelf', backref='block')
        book = db.relationship('Book', backref='block')
        chapter = db.relationship('Chapter', backref='block')
        note = db.relationship('Note', backref='block')

        def __init__(self,type, library_parent,parent_id):
                self.type= type
                self.library_parent = library_parent
                self.parent_id = parent_id
                self.object = "block"
        def __repr__(self):

                return f"<Block id={self.id} type={self.type}  parent_id={self.parent_id} library_parent={self.library_parent} object={self.object}>"
        
        def toJSON(self):
                return {"id": self.id, "type":self.type, "parent_id":self.parent_id, "lib_id":self.library_parent, "object":self.object}



class Shelf(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        name = db.Column(db.String(20))
        block_id = db.Column(db.Integer, db.ForeignKey('block.id'))
        object = db.Column(db.String(10), default="shelf")
        active_book = db.Column(db.String(36))

        # what kind of functoins can i write here
        def __init__(self,name, block_id, active_book):
                self.name = name
                self.block_id = block_id
                self.object = "shelf"
                self.active_book=active_book

        def toJSON(self):
                return {"id": self.id, "name":str(self.name), "block_id":self.block_id , "object":self.object, "active_book": self.active_book}

        def __repr__(self):
                return f"<Shelf  id={self.id} name={self.name} block_id={self.block_id} object={self.object} active_book={self.active_book}>"

class Cover(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        title =  db.Column(db.String(100))
        cover_image = db.Column(db.Text)
        bg_color = db.Column(db.String(14))

        def __init__(self, title, cover_image, bg_color):
                self.title = title
                self.cover_image = cover_image
                self.bg_color = bg_color

        def toJSON(self):
                return {"id": self.id, "cover_image": self.cover_image, "title": self.title, "bg_color": self.bg_color}
        
        def __repr__(self):
                return f"<Cover id={self.id} title={self.title} cover_image={self.cover_image} bg_color={self.bg_color}>"

class Book(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        name = db.Column(db.String(100))
        cover = db.Column(db.String(200))
        active_chapter = db.Column(db.String(36))
        object = db.Column(db.String(10), default="book")
        block_id = db.Column(db.Integer, db.ForeignKey('block.id'))

        def __init__(self,name, block_id, cover):
                self.name = name
                self.block_id = block_id
                self.cover = cover
                self.object = "book"

        def toJSON(self):
                return {"id": self.id, "name":str(self.name), "block_id":self.block_id, "cover":str(self.cover), "object":self.object, "active_chapter":self.active_chapter }
        
        def __repr__(self):
                return f"<Book  id={self.id} name={self.name} active_chapter={self.active_chapter} block_id={self.block_id} object={self.object} cover={self.cover} active_chapter={self.active_chapter}>"

class Chapter(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        name = db.Column(db.String(100))
        object = db.Column(db.String(10), default="chapter")
        block_id = db.Column(db.Integer, db.ForeignKey('block.id'))

        def __init__(self,name, block_id):
                self.name = name
                self.block_id = block_id
                self.object = "chapter"

        def toJSON(self):
                return {"id": self.id, "name": str(self.name), "block_id":self.block_id, "object":self.object}

        def __repr__(self):
                return f"<Chapter  id={self.id} name={self.name} block_id={self.block_id} object={self.object}>"

class Note(db.Model):
        id = db.Column(db.Text(36), primary_key=True, default=lambda: str(uuid.uuid4()))
        note_type = db.Column(db.String(10))
        content = db.Column(db.Text)
        object = db.Column(db.String(10), default="note")
        block_id = db.Column(db.Integer, db.ForeignKey('block.id'))

        def __init__(self, block_id, content, note_type):
                self.block_id = block_id
                self.content = content
                self.note_type = note_type
                self.object = "note"

        def toJSON(self):
                return {"id": self.id, "note_type":self.note_type, "content":self.content, "block_id":self.block_id, "object":self.object}
        
        def __repr__(self):
                return f"<Note  id={self.id} note_type={self.note_type} content={self.content}  block_id={self.block_id} object={self.object}>"

def token_required(f):
        @wraps(f)
        def decorator(*args, **kwargs):
                token = None
                if 'x-access-token' in request.headers:
                        token = request.headers['x-access-token']
                if not token:
                        return jsonify({'message': 'A valid token is missing'})
                print(token)
                try:
                        data = jwt.decode(token, app.config['SECRET_KEY'],algorithms=['HS256'])
                        print(data)
                        current_user = User.query.filter_by(id=data['user_id']).first() 
                except:
                        return jsonify({"message": "token is invalid"})
                return f(current_user, *args, **kwargs)
        return decorator


def get_book_cover(query):
        # New plan!!!
        # Scrap google images for the book cover
        # get the clicking url, then scrap the image from there
        # We are going to scrap two link one from the front page and one when the image is clicked
        search_url = "https://www.google.com/search?q={}&tbm=isch".format(query)
        search_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
        search_response = requests.get(search_url, headers=search_headers)

        # <a href="/url?esrc=s&amp;q=&amp;rct=j&amp;sa=U&amp;url=https://www.amazon.com/Think-Like-Monk-Train-Purpose/dp/1982134488&amp;ved=2ahUKEwiftM6VmqyAAxUnUKQEHfZhD-4Qr4kDegQICBAC&amp;usg=AOvVaw0tpXQ2U-D-wfo7WwvmV1op">
        #       <div class="jB2rPd"> 
        #               <span class="qXLe6d x3G5ab"> 
        #                       <span class="fYyStc">Think Like a Monk: Train...</span> 
        #               </span> 
        #               <span class="qXLe6d F9iS2e"> 
        #               <span class="fYyStc">www.amazon.com</span> </span> 
        #       </div>
        # </a>
        soup = BeautifulSoup(search_response.text, 'html.parser')
        table = soup.find('table', attrs={'class': 'IkMU6e'})
        a_tag = table.find_all('img')
        img_link = a_tag[0]['src']
        print(img_link)
        return img_link
 
def get_book_title(query):
        search_url = 'https://www.google.com/search?q={}&lr=lang_en'.format(query)
        search_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}
        search_response = requests.get(search_url, headers=search_headers)

        soup = BeautifulSoup(search_response.text, 'html.parser')
        title = soup.find_all('h3')[0].contents
        while title:
                if isinstance(title[0], str):
                        return title[0]
                else:
                        title = title[0].contents
        # Download the book cover images and save them with their corresponding titles
        print(title)
        return title
        # get_book_title(query)


# don't forget to require token and authenticate the user
@app.route("/chapter", methods=["GET"])
@cross_origin(supports_credentials=True)
def getChapters():
        chapter_json = {
                "title": "",
                "blocks":[]  
        }
        chapter_id = request.json.get("chapter_id")
        with app.app_context():
        # get the chapter block
                chapter_block = Block.query.filter_by(id=chapter_id).scalar()
                chapter_json["title"] = chapter_block.chapter[0].name
        # get the children of the chapter block
        # Create a loop that nests the blocks in order of their hierarchy 
                for notes in chapter_block.children:
                        # print(notes.note[0].toJSON())
                        chapter_json["blocks"].append(notes.note[0].toJSON())
                # chapter_block_children = chapter_block.children[0].note[0].toJSON()
                # print(chapter_block_children)
        return chapter_json



@app.route('/search', methods=["POST"])
@token_required
@cross_origin(supports_credentials=True)
def search(current_user):
        search_term = request.json.get("query")
        return_value = Cover.query.filter(Cover.title.like("%{}%".format(search_term))).limit(9).all()
        search_term = search_term + " book"
        data = []
        print(return_value)
        if return_value == []:
                formatted_url = get_book_cover(search_term)[6:]
                info = {
                "bg_color":"none",
                "title":get_book_title(search_term),
                "cover_image":formatted_url
                }
                data.append(info)
                return data
        for value in return_value:
                data.append(value.toJSON())
        return data

@app.route('/getheader', methods=["GET"])
@token_required
@cross_origin(supports_credentials=True)
def getheader(current_user):
        library = Library.query.filter_by(creator=current_user.id).scalar()
        if library.active_shelf != "none":
                active_shelf = Shelf.query.filter_by(block_id=library.active_shelf).scalar()
                if active_shelf.active_book == "none":
                        return {"status": "no-book"}
                active_book = Book.query.filter_by(block_id=active_shelf.active_book).scalar()
                # active_chapter_id = active_book.active_chapter
        if request.method == "GET":
                data = {}
                if library.active_shelf == "none":
                        return {"status": "no-shelf"}
                if active_book == None:
                        return {"status": "no-book"}
                book_block = Block.query.filter_by(id=active_book.block_id).scalar()
                
                chapter_block = Block.query.filter_by(id=active_book.active_chapter).scalar()
                if chapter_block == None:
                        # if the user doesn't have a chapter create an empty one
                        new_chapter_block =  Block(type="chapter", parent_id=active_book.block_id, library_parent=None)
                        db.session.add(new_chapter_block)
                        db.session.commit()
                        new_chapter = Chapter(name="", block_id=new_chapter_block.id)
                        db.session.add(new_chapter)
                        db.session.commit()
                        active_book.active_chapter = new_chapter_block.id
                        db.session.add(active_book)
                        db.session.commit()
                        chapter_block = new_chapter_block
                chapter = Chapter.query.filter_by(block_id=chapter_block.id).scalar()
                # book_block = Block.query.filter_by(id=chapter_block.parent_id).scalar()
                book = Book.query.filter_by(block_id=book_block.id).scalar()
                
                # get list of chapters with their IDS
                # use book block and iterate over the children
                chapter_list = []
                for child in book_block.children:
                        # children is a chapter block, extract name and the id
                        chapter_id = child.id
                        chapter_title = child.chapter[0].name
                        if child.id == chapter_block.id:
                                value = True
                        else:
                                value = False
                        chapter_list.append({"chapter_id":chapter_id,"chapter_title":chapter_title, "chapter_active": value})

                data = {"title": book.name, "chapter":chapter.name, "cover":book.cover, "chapter_list": chapter_list, "status":"400"}
                return data

@app.route('/addshelf', methods=["POST", "DELETE"])
@token_required
@cross_origin(supports_credentials=True)
def addShelf(current_user):
        # get the user's library
        # make the library the parent of the shelf
        # create the shelf
        if request.method == "POST":
                if not request.json.get("name")[0]:
                        return {"error": "The name of the shelf is not sent"}
                user = current_user.toJSON()
                with app.app_context():
                        user_lib = Library.query.filter_by(creator=user["id"]).scalar()
                        # get the active book and set it to none
                        
                        print(user_lib)
                        shelf_block = Block(type="shelf", library_parent=user_lib.id, parent_id=None)
                        db.session.add(shelf_block)
                        db.session.commit()
                        shelf = Shelf(name=request.json.get("name"), block_id=shelf_block.id, active_book="none")
                        db.session.add(shelf)
                        db.session.commit()
                        user_lib.active_shelf = shelf_block.id
                        db.session.add(user_lib)
                        db.session.commit()
                        
                return {"status": "400"}

@app.route('/getnotes', methods=["GET", "POST", "DELETE","PUT"])
@token_required
@cross_origin(supports_credentials=True)
def getnotes(custom_user):
        library = Library.query.filter_by(creator=custom_user.id).scalar()
        active_shelf = Shelf.query.filter_by(block_id=library.active_shelf).scalar()
        if active_shelf == None:
                return {"status": "no-book"}
        active_book = Book.query.filter_by(block_id=active_shelf.active_book).scalar()
        if active_book == None:
                return {"status": 'no-book'}
        active_chapter_id = active_book.active_chapter
        if request.method == "GET":
                if library.active_shelf  == "none":
                        return {"status": 'null'}
                
                notes = Block.query.filter_by(parent_id=active_chapter_id).all()
                response = []
                print(active_chapter_id)
                # if notes.length() == 0:
                #         return {"status": 404}
                print(active_chapter_id)
                for note in notes:
                        # print(note)
                        response.append(note.note[0].toJSON())
                # response.append({"status":"400"})
                return response
        if request.method == "POST":
                notes = Block.query.filter_by(parent_id=active_chapter_id).all()
                response = []
                note_block = Block(type="note", parent_id=active_chapter_id, library_parent=None)
                db.session.add(note_block)
                db.session.commit()
                note = Note(note_type="note", block_id=note_block.id, content=request.json.get("content"))
                db.session.add(note)
                db.session.commit()
                notes = Block.query.filter_by(parent_id=active_chapter_id).all()
                for note in notes:
                        response.append(note.note[0].toJSON())

                return response
        if request.method == "DELETE":
                note_block = Block.query.filter_by(id=request.json.get("block_id")).scalar()
                print(note_block)
                db.session.delete(note_block)
                db.session.commit()
                return {"status": 400}
        if request.method == "PUT":
                # get the innerblock id
                note = Note.query.filter_by(id=request.json.get("id")).scalar()
                note.content = request.json.get("content")
                db.session.add(note)
                db.session.commit()
                return {"status": "400"}

@app.route('/update_active_block', methods=['POST'])
@token_required
@cross_origin(supports_credentials=True)
def update_block(current_user):
        if request.method == "POST":
                active_shelf_id = Library.query.filter_by(creator=current_user.id).scalar().active_shelf
                active_shelf = Shelf.query.filter_by(block_id=active_shelf_id).scalar()
                if request.json.get("type") == "chapter":
                        active_book = Book.query.filter_by(block_id=active_shelf.active_book).scalar()
                        active_book.active_chapter = request.json.get("chapter_id")
                        db.session.add(active_book)
                        db.session.commit()
                        return {"status": "400", "active_chapter": request.json.get("chapter_id")}
                if request.json.get("type") == "book":
                        active_shelf.active_book = request.json.get("book_id")
                        db.session.add(active_shelf)
                        db.session.commit()
                        active_chapter = Book.query.filter_by(block_id=active_shelf.active_book).scalar().active_chapter
                        return {"status": "400", "active_chapter": active_chapter}
                if request.json.get("type") == "shelf":
                        library = Library.query.filter_by(creator=current_user.id).scalar()
                        library.active_shelf = request.json.get("shelf_id")
                        db.session.add(library)
                        db.session.commit()
                        return {"status": "400"}
                # I think this is useless, thinkkkk
                if request.json.get("type") == "active_book_shelf":
                        active_shelf_id = Library.query.filter_by(creator=current_user.id).scalar().active_shelf
                        active_shelf = Shelf.query.filter_by(block_id=active_shelf_id).scalar()
                        active_shelf.active_book = request.json.get("book_id")
                        db.session.add(active_shelf)
                        db.session.commit()
                        return {"status": "400"}

# def select_rand_chapter(book_id):
#         with app.app_context():
#                 book = Block.query.filter_by(id=book_id).scalar()
#                 chapters = book.chapter
#                 print(chapters)
#                 print("yes I will")
# select_rand_chapter("9d96466f-a423-4b86-acf8-f70aa3bf12f8")
@app.route('/deleteblock', methods=['DELETE'])
@token_required
@cross_origin(supports_credentials=True)
def deleteBlock(current_user):
        library = Library.query.filter_by(creator=current_user.id).scalar()
        if request.json.get("type") == "book":
                active_shelf = Shelf.query.filter_by(block_id=library.active_shelf).scalar()
                book_to_delete = Block.query.filter_by(id=request.json.get("block_id")).scalar()
                # check to see if book is that active book
                if book_to_delete.id == active_shelf.active_book:
                        # get rid of the block
                        db.session.delete(book_to_delete)
                        db.session.commit()
                        active_shelf_block = Block.query.filter_by(id=library.active_shelf).scalar()
                        # set the active book on the active shelf to another book on the shelf
                        books_on_shelf = active_shelf_block.children
                        if len(books_on_shelf) == 0:
                                active_shelf.active_book = "none"
                                db.session.add(active_shelf)
                                db.session.commit() 
                        else:
                                active_shelf.active_book = books_on_shelf[0].id
                                db.session.add(active_shelf)
                                db.session.commit()
                        return {"status": "400"}
                else:
                        db.session.delete(book_to_delete)
                        db.session.commit()
                        return {"status": "400"}
        if request.json.get("type") == "chapter":
                active_shelf = Shelf.query.filter_by(block_id=library.active_shelf).scalar()
                active_book = Book.query.filter_by(block_id=active_shelf.active_book).scalar()
                chapter_to_delete = Block.query.filter_by(id=request.json.get("block_id")).scalar()
                # check to see if book is that active book
                if chapter_to_delete.id == active_book.active_chapter:
                        # get rid of the block
                        db.session.delete(chapter_to_delete)
                        db.session.commit()
                        active_book_block = Block.query.filter_by(id=active_shelf.active_book).scalar()
                        # set the active chapter on the active book to another chapter on the book
                        chapters_on_book = active_book_block.children
                        if len(chapters_on_book) > 0:
                                active_book.active_chapter = chapters_on_book[0].id
                                db.session.add(active_book)
                                db.session.commit()
                        else:
                                active_book.active_chapter = "none"
                                db.session.add(active_book)
                                db.session.commit()
                        return {"status": "400"}
                else:
                        db.session.delete(chapter_to_delete)
                        db.session.commit()
                        return {"status": "400"}
        if request.json.get("type") == "shelf":
                block_id = request.json.get("block_id")
                shelf_to_delete = Block.query.filter_by(id=block_id).scalar()
                # first delete all the child blocks with there inner blocks
                if len(shelf_to_delete.children) != 0:
                        for outter_book_block in shelf_to_delete.children:
                                # check to see if book has chapters if so delete those chapters
                                if len(outter_book_block.children) != 0:
                                        for outter_chapter_block in outter_book_block.children:
                                                # check to see if the chapter has any notes in it and if so delete them
                                                if len(outter_chapter_block.children) != 0:
                                                        for outter_note_block in outter_chapter_block.children:
                                                                # first delete the inner chapter block
                                                                inner_note = outter_note_block.note[0]
                                                                db.session.delete(inner_note)
                                                                db.session.commit()
                                                                db.session.delete(outter_note_block)
                                                                db.session.commit()
                                                inner_chap = outter_chapter_block.chapter[0]
                                                db.session.delete(inner_chap)
                                                db.session.commit()
                                                db.session.delete(outter_chapter_block)
                                                db.session.commit()
                                inner_book = outter_book_block.book[0]
                                db.session.delete(inner_book)
                                db.session.commit()
                                db.session.delete(outter_book_block)
                                db.session.commit()
                inner_shelf = shelf_to_delete.shelf[0]
                db.session.delete(inner_shelf)
                db.session.commit()
                db.session.delete(shelf_to_delete)
                db.session.commit()
                # set a new active shelf
                lib = Library.query.filter_by(creator=current_user.id).scalar()
                if len(lib.children) == 0:
                        lib.active_shelf = "none"
                        db.session.add(lib)
                        db.session.commit()
                        return {"status": "400"}
                last_elmnt = len(lib.children) - 1
                lib.active_shelf = lib.children[last_elmnt].id
                db.session.add(lib)
                db.session.commit()
                return {"status": "400"}
        if request.json.get("type") == "note":
                active_note_block = Block.query.filter_by(id=request.json.get("block_id")).scalar()
                inner_note = active_note_block.note[0]
                db.session.delete(inner_note)
                db.session.commit()
                db.session.delete(active_note_block)
                db.session.commit()
                return {"status": "400"}

@app.route('/addbook', methods=["POST", "GET", "PUT","DELETE"])
@token_required
@cross_origin(supports_credentials=True)
def addbook(current_user):
        if request.method == "POST":
                if not request.json.get("name")[0]:
                        return {"error": "Name is not sent"}
                if not request.json.get("cover")[0]:
                        return {"error": "The cover Image is not set"}
                # if not request.json.get("parent_shelf_id")[0]: 
                #         return {"error": "Something went wrong"}
                user = current_user.toJSON()
                active_shelf_id = Library.query.filter_by(creator=current_user.id).scalar().active_shelf
                active_shelf = Shelf.query.filter_by(block_id=active_shelf_id).scalar()
                book_block = Block(type="book", parent_id=active_shelf_id, library_parent=None)
                db.session.add(book_block)
                db.session.commit()
                book = Book(name=request.json.get("name"), block_id=book_block.id, cover=request.json.get("cover"))
                db.session.add(book)
                db.session.commit()
                # make it active_book on the shelf
                active_shelf.active_book = book_block.id
                db.session.add(active_shelf)
                db.session.commit()
                # Create a chapter with every book that gets created 
                chapter_block = Block(type="chapter", library_parent=None, parent_id=book_block.id)
                db.session.add(chapter_block)
                db.session.commit()
                chapter = Chapter(name="", block_id=chapter_block.id) 
                db.session.add(chapter)
                db.session.commit()
                # make the chapter an active chapter for the book and the book an active book for the user
                book.active_chapter = chapter_block.id
                db.session.add(book)
                db.session.commit()
                note_block = Block(type="note", library_parent=None, parent_id=chapter_block.id)
                db.session.add(note_block)
                db.session.commit()
                note = Note(content="", block_id=note_block.id, note_type="note")
                db.session.add(note)
                db.session.commit()
                current_user.active_book = book_block.id
                db.session.add(current_user)
                db.session.commit()
              
                return {"status":"400"}
        if request.method == "PUT":
                active_shelf_id = Library.query.filter_by(creator=current_user.id).scalar().active_shelf
                active_shelf = Shelf.query.filter_by(block_id=active_shelf_id).scalar()
                book_block = Block.query.filter_by(id=active_shelf.active_book).scalar()
                book = book_block.book[0]
                book.name = request.json.get("name")
                db.session.add(book)
                db.session.commit()
                return{"status":"400"}

@app.route("/addchapter", methods=["POST", "PUT"])
@token_required
@cross_origin(supports_credentials=True)
def addchapter(current_user):
        lib = Library.query.filter_by(creator=current_user.id).scalar()
        active_shelf = Shelf.query.filter_by(block_id=lib.active_shelf).scalar()
        active_book = Book.query.filter_by(block_id=active_shelf.active_book).scalar()
        if request.method == "POST":
                new_chapter_block =  Block(type="chapter", parent_id=active_book.block_id, library_parent=None)
                db.session.add(new_chapter_block)
                db.session.commit()
                new_chapter = Chapter(name=request.json.get("chapter_name"), block_id=new_chapter_block.id)
                db.session.add(new_chapter)
                db.session.commit()
                active_book.active_chapter = new_chapter_block.id
                db.session.add(active_book)
                db.session.commit()
                return {"status": 400, "active_chapter":new_chapter_block.id}
        if request.method == "PUT":
                chapter_block = Block.query.filter_by(id=active_book.active_chapter).scalar()
                chapter = chapter_block.chapter[0]
                chapter.name = request.json.get("chapter_name")
                db.session.add(chapter)
                db.session.commit()
                return {"status": 400, "name": chapter.name, "chapter_id": chapter_block.id}

@app.route("/shelf", methods=["GET"])
@token_required
@cross_origin(support_credentials=True)
def getShelfs(current_user):
        if request.method == "GET":
                # just send the books of the active shelf and ignore the rest
                # and also send the list of shelf names 
                data = {}
                books = []
                # get the active_shelf
                lib = Library.query.filter_by(creator=current_user.id).scalar()
                # if active_shelf is null create a fall back
                active_shelf = Block.query.filter_by(id=lib.active_shelf).scalar()
                if active_shelf == None:
                        return{"status": "no-shelf"}
                shelfs = lib.children

                data["active_shelf"] = active_shelf.toJSON()
                data["active_shelf"]["props"] = active_shelf.shelf[0].toJSON()
                data["active_shelf"]["books"] = []
                data["title_list"] = []
                # shelf_name = active_shelf.shelf[0].name
                # shelf_id = active_shelf.id
                is_active = False
                for shelf in shelfs:
                        is_active=False
                        if shelf.id == lib.active_shelf:
                                is_active = True
                        data["title_list"].append({"shelf_id":shelf.id,"title":shelf.shelf[0].name, "is_active": is_active})
                        # for book in shelf.children:
                        #         data["books"].append(book.book[0].toJSON())
                data["active_shelf"]["books"] = []
                for book in active_shelf.children:
                        data["active_shelf"]["books"].append(book.book[0].toJSON())
                # data["active_shelf"]["books"] = books
                return data
       

@app.route("/fetch", methods=["POST"])
@token_required
@cross_origin(support_credentials=True)
def get_user_data(current_user):
        if request.method == "POST":
                res = {}
                print(current_user)
                user_data = current_user.toJSON()
                res["user"] = user_data
                return res

@app.route("/login", methods=["POST"])
@cross_origin(support_credentials=True)
def login():
        if not request.json.get('email')[0] or not request.json.get('password')[0]:
                return{"error":"Could not verify invalid request"}
        user = User.query.filter_by(email=request.json.get('email')[0]).first()
        if not user:
                return {"error": "Are you fucking high"}
        if check_password_hash(user.password, request.json.get('password')[0]):
                token = jwt.encode({'user_id': user.id}, app.config['SECRET_KEY'])
                return jsonify({'token': token})
        return {"error": "I am sorry, not allowed"}

@app.route("/register", methods=["GET", "POST"])
@cross_origin(support_credentials=True)
def register():
        if request.method == "POST":
                if  request.json.get("name") == ['']:
                        return {"msg": "You forgot to add your name", "prblm": "name"}
                if  request.json.get("email") == ['']:
                        return {"msg": "You forgot to add your email", "prblm": "email"}
                if  request.json.get("password") == ['']:
                        return {"msg": "You forgot to add your password", "prblm": "password"}
                if  request.json.get("confirm_password") == ['']:
                        return {"msg": "You forgot to add your confirmation password", "prblm": "confirmaion password"}
                if request.json.get("password") != request.json.get("confirm_password"):
                        return {"msg": "The passwords you entered don't match", "prblm":"Password Mismatch"}
                email = request.json.get("email")[0]
                password =  generate_password_hash(request.json.get("password")[0])
                name  = request.json.get("name")[0]
                
                with app.app_context():
                        # user = db.session.execute(db.select(User).filter_by(email=email)).scalars()
                        check_user = db.session.execute(text(f"SELECT email FROM User WHERE email == '{email}'  ")).fetchall()
                        # for stuff in check_user:
                        #         print(stuff)
                        print(len(check_user))
                        if not len(check_user) == 0:
                                return {"email":"That Email is already taken"}
                        # db.session.execute(text(f"INSERT INTO User(email, password, name) VALUES('{email}', '{password}', '{name}');"))
                        
                        user = User(
                                name=name,
                                password=password,
                                email=email
                        )

                        db.session.add(user)
                        db.session.commit()
                        # access_token = create_access_token(identity=email)

                        new_user = User.query.filter_by(email=email).scalar()
                        print(new_user)
                        print("Sssss")
                        library = Library(creator=new_user.id, name={user.name})
                        db.session.add(library)
                        db.session.commit()
                        shelf_block = Block(type="shelf", library_parent=library.id, parent_id=None, )
                        db.session.add(shelf_block)
                        db.session.commit()
                        shelf = Shelf(name="sup ahahhah", block_id=shelf_block.id)
                        db.session.add(shelf)
                        db.session.commit()
                
        else:
                return "Not Allowed"


def format_data_to_json(data):
        return {
                "name": data.name,
                "email": data.email,
                "user_library": data.user_library
        }

        
def structure_inner_block(block):
        data = {}
        if block.type == "chapter":
                data = block.chapter[0].toJSON()
                print("--------------------")
                print(block.chapter)
                print("--------------------")

                return data
        if block.type == "shelf":
                data = block.shelf[0].toJSON()
                return data
        if block.type == "book":
                data = block.book[0].toJSON()
                return  data
        if block.type == "note":
                data = block.note[0].toJSON()
                return data

def nestContentJSON(object):
        res = {}
        if len(object.children) != 0:
                for child in object.children:
                        res[child.id] = child.toJSON()
                        # print(child)
                        res[child.id][child.type] = structure_inner_block(child)
                        for kids in child.children:
                                res[child.id]["child"] = nestContentJSON(child)                    
        return res

def nestJSON(object):
        res = {}
        lib = {}
        if not hasattr(object, "library"):
                lib[object.id] = object.toJSON()
        if len(object.children) != 0:
                for child in object.children:
                        res[child.id] = child.toJSON()
                        res[child.id][child.type] = structure_inner_block(child)
                        for kids in child.children:
                                res[child.id]["child"] = nestContentJSON(child)                    
        # print(res)
        if len(lib.keys()) > 0:
                id = list(lib.keys())[0]
                print(lib[id])
                print("asdasdasdasdasdasds")
                lib[id]["child"] = res 
        return lib

if __name__ == '__main__':
        app.run(debug=True)
 