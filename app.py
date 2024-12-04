from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from database import DBhandler
from datetime import datetime
import hashlib
import sys
import math

application = Flask(__name__)
application.config["SECRET_KEY"] = "onionstu"
DB = DBhandler()

@application.route("/")
def hello():
    # return render_template("index.html")
    return redirect(url_for('view_list'))

@application.route("/list")
def view_list():
    page = request.args.get("page", 0, type=int)
    category = request.args.get("category", "all")
    per_page=10 # item count to display per page
    per_row=5 # item count to display per row
    row_count=int(per_page/per_row)
    start_idx=per_page*page
    end_idx=per_page*(page+1)
    if category=="all":
        data = DB.get_items() #read the table
    else:
        data = DB.get_items_bycategory(category)
        
    data = dict(sorted(data.items(), key=lambda x:x[0], reverse=False))
    item_counts = len(data)
    if item_counts<=per_page:
        data = dict(list(data.items())[:item_counts])
    else:
        data = dict(list(data.items())[start_idx:end_idx])
    for i in range(row_count):#last row
        if (i == row_count-1) and (item_counts%per_row != 0):
            locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:])
        else:
            locals()['data_{}'.format(i)] = dict(list(data.items())[i*per_row:(i+1)*per_row])
    return render_template( "list.html", datas=data.items(),
                        row1=locals()['data_0'].items(),
                        row2=locals()['data_1'].items(),
                        limit=per_page, page=page, page_count=int(math.ceil(item_counts/per_page)),
                        total=item_counts, category=category)


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
        keywords = request.form.getlist("keyword[]")
        id = session['id']
        image_file=request.files["img_path"]
        image_file.save("static/images/{}".format(image_file.filename))
        DB.reg_review(data['reviewTitle'], data, image_file.filename, keywords, id)
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

@application.route("/login")
def login():
    return render_template("login.html")

@application.route("/signup")
def signup():
    return render_template("signup.html")

@application.route('/purchase')
def purchase():
    return render_template('purchase.html')

@application.route('/purchase_list')
def purchase_list():
    return render_template('purchase_list.html')

@application.route('/my_page/<user_id>')
def my_page(user_id):
    email = DB.get_email_byname(user_id)
    tel = DB.get_tel_byname(user_id)
    hdata=DB.get_like_items_byuser(user_id)
    hdata=dict(sorted(hdata.items(), key=lambda item: item[1]['time'], reverse=False))
    hdata=list(hdata.items())[:3]
    pdata=DB.get_item_byuser(user_id)
    pdata=list(pdata.items())[:3]
    rdata=DB.get_review_byuser(user_id)
    rdata=list(rdata.items())[:2]
    return render_template('my_page.html',
                           email = email, tel = tel,
                           hdata=hdata, pdata=pdata, rdata=rdata,
                           ptotal= len(pdata), rtotal= len(rdata),
                           user_id=user_id)

# 페이지네이션 함수 따로 뺌
def paginate(data, page=0, per_page=6, per_row=2):
    row_count=int(per_page/per_row)
    start_idx=per_page*page
    end_idx=per_page*(page+1)
    item_counts=len(data)
    rows={}

    if item_counts<=per_page:
        data=dict(list(data.items())[:item_counts])
    else:
        data=dict(list(data.items())[start_idx:end_idx])
    for i in range(row_count):
        if (i==row_count-1) and (item_counts%per_row != 0):
            rows[f'data_{i}'] = dict(list(data.items())[i*per_row:])
        else:
            rows[f'data_{i}'] = dict(list(data.items())[i*per_row:(i+1)*per_row])
    return data, rows, int(math.ceil(item_counts/per_page))

@application.route('/my_like/<user_id>/')
def my_like(user_id):
    data=DB.get_like_items_byuser(user_id)
    page = request.args.get("page", 0, type=int)
    per_page=6
    per_row=2
    item_counts = len(data)
    page_data, rows, page_count= paginate(data, page, per_page, per_row)
    
    return render_template( "my_like.html", datas=page_data.items(), user_id=user_id,
                        row1=rows['data_0'].items(),
                        row2=rows['data_1'].items(),
                        limit=per_page, page=page, page_count=page_count,
                        total=item_counts)

@application.route('/my_post/<user_id>/')
def my_post(user_id):
    page = request.args.get("page", 0, type=int)
    per_page=6
    per_row=2

    data=DB.get_item_byuser(user_id)
    item_counts = len(data)
    page_data, rows, page_count= paginate(data, page, per_page, per_row)
    
    return render_template( "my_post.html", datas=page_data.items(), user_id=user_id,
                        row1=rows['data_0'].items(),
                        row2=rows['data_1'].items(),
                        limit=per_page, page=page, page_count=page_count,
                        total=item_counts)

@application.route('/my_review/<user_id>/')
def my_review(user_id):
    page = request.args.get("page", 0, type=int)
    per_page=6
    per_row=2

    data=DB.get_review_byuser(user_id)
    item_counts = len(data)
    page_data, rows, page_count= paginate(data, page, per_page, per_row)
    
    return render_template( "my_review.html", datas=page_data.items(), user_id=user_id,
                        row1=rows['data_0'].items(),
                        row2=rows['data_1'].items(),
                        limit=per_page, page=page, page_count=page_count,
                        total=item_counts)

@application.route('/profile_edit')
def profile_edit():
    user_id = session['id']
    email = DB.get_email_byname(user_id)
    tel = DB.get_tel_byname(user_id)
    email_parts = email.split('@')
    return render_template('profile_edit.html', email=email_parts[0], email_domain=email_parts[1], tel=tel)

@application.route("/id_find")
def id_find():
    return render_template("id_find.html")

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
    
@application.route('/show_heart/<name>/', methods=['GET'])
def show_heart(name):
    my_heart = DB.get_heart_byname(session['id'],name)
    return jsonify({'my_heart': my_heart})

@application.route('/like/<name>/', methods=['POST'])
def like(name):
    timestamp = datetime.now().isoformat()
    my_heart = DB.update_heart(session['id'],'Y',timestamp, name)
    return jsonify({'msg': '마음에 들어요 완료!'})
 
@application.route('/unlike/<name>/', methods=['POST'])
def unlike(name):
    timestamp = datetime.now().isoformat()
    my_heart = DB.update_heart(session['id'],'N',timestamp, name)
    return jsonify({'msg': '마음에 들어요 취소 완료!'})

@application.route("/profile_edit_post", methods=['POST'])
def change_pw():
    cdata=request.form
    cpw=request.form['pw']
    cpw_hash = hashlib.sha256(cpw.encode('utf-8')).hexdigest()
    now_id=session['id']
    if DB.change_user(now_id,cdata,cpw_hash):
        return redirect(url_for('my_page', user_id=session['id']))
    else:
        flash("이전 비밀번호와 같습니다! 다시 입력해주세요")
        return redirect(url_for('profile_edit'))
        
@application.route("/logout")
def logout_user():
    session.clear()
    return redirect(url_for('view_list'))

@application.route('/find-id', methods=['GET', 'POST'])
def find_id():
    if request.method == 'POST':
        email = request.json.get('email')
        tel = request.json.get('tel')
        hidden_id = DB.find_id_by_email_tel(email, tel)
        if hidden_id:
            return jsonify({"status": "success", "id": hidden_id})
        else:
            return jsonify({"status": "fail", "message": "등록된 정보를 찾을 수 없습니다."})
    return render_template('id_find.html')

@application.route("/search", methods=["GET"])
def search():
    query = request.args.get("query", "")
    if query:
        matching_items = DB.search_item_by_name(query)
        item_count = len(matching_items)
        matching_items = dict(sorted(matching_items.items(), key=lambda x: x[0], reverse=False))
        return render_template("search_results.html", 
                               datas=matching_items.items(),
                               total = item_count,
                               query = query)
    else:
        flash("Please enter a search query")
        return redirect(url_for('view_list'))
if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=True)
    
