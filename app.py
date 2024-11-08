from flask import Flask, render_template, request, flash, redirect, url_for, session
from database import DBhandler
import hashlib
import sys

application = Flask(__name__)
application.config["SECRET_KEY"] = "onionstu"
DB = DBhandler()

@application.route("/")
def hello():
    return render_template("index.html")

@application.route("/list")
def view_list():
    return render_template("list.html")

@application.route("/review")
def view_review():
    return render_template("review.html")

@application.route("/reg_items")
def reg_item():
    return render_template("reg_items.html")

@application.route("/submit_item_post", methods=['POST'])
def reg_item_submit_post():
    image_file=request.files["file"]
    image_file.save("static/images/{}".format(image_file.filename))
    data=request.form
    DB.insert_item(data['name'], data, image_file.filename)
    return render_template("submit_item_result.html", data=data, img_path="static/images/{}".format(image_file.filename))

@application.route("/reg_reviews")
def reg_review():
    return render_template("reg_reviews.html")

@application.route('/product_detail')
def product_detail():
    return render_template('product_detail.html')

@application.route('/review_detail')
def review_detail():
    return render_template('review_detail.html')


@application.route("/login")
def login():
    return render_template("login2.html")

@application.route("/signup")
def signup():
    return render_template("signup.html")

@application.route("/signup_post", methods = ['POST'])
def register_user():
    data=request.form
    pw=request.form['pw']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    if DB.insert_user(data,pw_hash):
        return render_template("login.html")
    else:
        flash("user id already exist!")
        return render_template("signup.html")

@application.route("/login_comfirm", methods = ['POST'])
def login_user():
    id_ = request.form['id']
    pw = request.form['pw']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    if DB.find_user(id_ , pw_hash):
        session['id'] = id_
        return redirect(url_for('view_list'))
    else:
        flash("wrong ID or PW!")
        return render_template("login2.html")
    
@application.route("/logout")
def logout_user():
    session.clear()
    return redirect(url_for('view_list'))


if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
    
