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
    # return redirect(url_for('view_list'))

@application.route("/list")
def view_list():
    page = request.args.get("page", 0, type=int)
    per_page=10 # item count to display per page
    per_row=5 # item count to display per row
    row_count=int(per_page/per_row)
    start_idx=per_page*page
    end_idx=per_page*(page+1)
    if DB.get_items():
        data = DB.get_items() #read the table
        item_counts = len(data)
        data = dict(list(data.items())[start_idx:end_idx])
        for i in range(row_count):#last row
            if (i == row_count-1) and (item_counts%per_row != 0):
                locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:])
            else:
                locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:(i+1)*per_row])
        return render_template( "list.html", datas=data.items(),
                            row1=locals()['data_0'].items(),
                            row2=locals()['data_1'].items(),
                            limit=per_page, page=page, page_count=int((item_counts/per_page)+1),
                            total=item_counts)
    else:
        return render_template("list.html",total=0)

@application.route("/review")
def view_review():
    page = request.args.get("page", 0, type=int)
    per_page=6 # item count to display per page
    per_row=2 # item count to display per row
    row_count=int(per_page/per_row)
    start_idx=per_page*page
    end_idx=per_page*(page+1)
    if DB.get_reviews():
        data = DB.get_reviews() #read the table
    
        review_counts = len(data)
        data = dict(list(data.items())[start_idx:end_idx])
        for i in range(row_count):#last row
            if (i == row_count-1) and (review_counts%per_row != 0):
                locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:])
            else:
                locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:(i+1)*per_row])
        return render_template( "review.html", datas=data.items(),
                            row1=locals()['data_0'].items(),
                            row2=locals()['data_1'].items(),
                            row3=locals()['data_2'].items(),
                            limit=per_page, page=page, page_count=int((review_counts/per_page)+1),
                            total=review_counts)
    else:
        return render_template( "review.html",total=0)

@application.route("/reg_items")
def reg_item():
    return render_template("reg_items.html")

@application.route("/submit_item_post", methods=['POST'])
def reg_item_submit_post():
    image_file=request.files["img_path"]
    image_file.save("static/images/{}".format(image_file.filename))
    data=request.form
    id = session['id']
    DB.insert_item(data['item'], data, id, image_file.filename)
    return render_template("submit_item_result.html", data=data, img_path="static/images/{}".format(image_file.filename))

@application.route("/reg_review_init/<name>/")
def reg_review_init(name):
    return render_template("reg_reviews.html", name=name)

@application.route("/reg_reviews", methods=['GET', 'POST'])
def reg_review():
    if request.method == "GET":
        return render_template("reg_reviews.html")
    elif request.method == "POST":
        data=request.form
        image_file=request.files["img_path"]
        image_file.save("static/images/{}".format(image_file.filename))
        DB.reg_review(data['reviewTitle'], data, image_file.filename)
        return redirect(url_for('view_review'))

@application.route('/product_detail/<name>/')
def product_detail(name):
    print("###name:",name)
    data = DB.get_item_byname(str(name))
    print("####data:",data)
    return render_template('product_detail.html', name=name, data=data)

@application.route('/review_detail/<name>/')
def review_detail(name):
    print("####name:", name)
    data = DB.get_review_byname(str(name))
    print("####data:", data)
    return render_template('review_detail.html', name=name, data=data)

@application.route('/my_purchase')
def my_purchase():
    return render_template('my_purchase.html')

@application.route('/my_post')
def my_post():
    return render_template('my_post.html')

@application.route("/login")
def login():
    return render_template("login.html")

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

@application.route("/login_confirm", methods = ['POST'])
def login_user():
    id_ = request.form['id']
    pw = request.form['pw']
    pw_hash = hashlib.sha256(pw.encode('utf-8')).hexdigest()
    if DB.find_user(id_ , pw_hash):
        session['id'] = id_
        return redirect(url_for('view_list'))
    else:
        flash("wrong ID or PW!")
        return render_template("login.html")
    
@application.route("/check_id", methods=["POST"])
def check_id():
    data = request.get_json()
    user_id = data.get("id")

    if DB.user_duplicate_check(user_id):
        return {"exists": False}
    else:
        return {"exists": True}
    
@application.route("/logout")
def logout_user():
    session.clear()
    return redirect(url_for('view_list'))



if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
    
