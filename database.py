import pyrebase
import json

class DBhandler:
    def __init__ (self):
        with open('./authentication/firebase_auth.json') as f:
            config = json.load(f)

        firebase = pyrebase.initialize_app(config)
        self.db = firebase.database()

    def insert_item(self, name, data, id, img_path):
        item_info ={
            "addr": data['addr'],
            "delivery_method": data['delivery_method'],
            "price": data['price'],
            "item": data['item'],
            "itemexp": data['itemexp'],
            "major_category": data['major_category'],
            "detail_category": data['detail_category'],
            "is_preorder": data['is_preorder'],
            "seller_id": id,
            "img_path": img_path
        }
        self.db.child("item").child(name).set(item_info)
        print(data,img_path)
        return True
    
    def insert_user(self, data, pw):
        user_info ={
            "id": data['id'],
            "pw": pw,
           # "nickname": data['nickname'],
            "email": (data['email'] + '@' + data['email_domain']),
            "tel": data['tel']
        }
        if self.user_duplicate_check(str(data['id'])):
            self.db.child("user").push(user_info)
            print(data)
            return True
        else:
            return False
        
    def user_duplicate_check(self, id_string):
        users = self.db.child("user").get()
        print("users###",users.val())
        if str(users.val()) == "None": # first registration
            return True
        else:
            for res in users.each():
                value = res.val()

                if value['id'] == id_string:
                    return False
                return True
    
    def find_user(self, id_, pw_):
        users = self.db.child("user").get()
        target_value = []
        for res in users.each():
            value = res.val()
            if value['id'] == id_ and value['pw'] == pw_:
                return True
        return False
    
    def get_items(self):
        items = self.db.child("item").get().val()
        return items
    
    def get_item_byname(self, name):
        items = self.db.child("item").get()
        target_value=""
        print("###########",name)
        for res in items.each():
            key_value = res.key()
            if key_value == name:
                target_value=res.val()
        return target_value
    
    def get_items_bycategory(self, category):
        items = self.db.child("item").get()
        target_value=[]
        target_key=[]
        for res in items.each(): 
            value = res.val()
            key_value = res.key()
            if value['major_category'] == category:
                target_value.append(value)
                target_key.append(key_value)
            if value['detail_category'] == category:
                target_value.append(value)
                target_key.append(key_value)
        print("######target_value",target_value)
        new_dict={}
        for k,v in zip(target_key,target_value):
            new_dict[k]=v
        return new_dict

    
    def reg_review(self, name, data, img_path, keywords, id):
        review_info={
            "title": data['reviewTitle'],
            "rate_item": data['itemStar'],
            "rate_deliver": data['deliverStar'],
            "review": data['reviewContents'],
            "review_item": data['review_item'],
            "reviewer_id": id,
            "img_path": img_path,
            "keywords": keywords
        }
        self.db.child("review").child(name).set(review_info)
        return True
    
    def get_reviews(self):
        reviews = self.db.child("review").get().val()
        return reviews
    
    def get_review_byname(self, name):
        reviews = self.db.child("review").get()
        target_value=""
        print("###########", name)
        for res in reviews.each():
            key_value = res.key()
            if key_value == name:
                target_value=res.val()
        return target_value
    
    def get_heart_byname(self, user_id, name):
        hearts = self.db.child("heart").child(user_id).get()
        target_value=""
        if hearts.val() == None:
            return target_value
        for res in hearts.each():
            key_value = res.key()
            if key_value == name:
                target_value = res.val()
        return target_value
    
    def update_heart(self, user_id, isHeart, timestamp, item):
        heart_info ={
            "interested": isHeart,
            "time": timestamp
        }
        self.db.child("heart").child(user_id).child(item).set(heart_info)
        return True
    
    def get_email_byname(self, id):
        users = self.db.child("user").get()
        for res in users.each():
            value=res.val()
            if value['id'] == id:
                email = value['email']
        return email
    
    def get_tel_byname(self, id):
        users = self.db.child("user").get()
        for res in users.each():
            value=res.val()
            if value['id'] == id:
                tel = value['tel']
        return tel

    def change_user(self, id, data, cpw):
        users = self.db.child("user").get()
        for res in users.each():
            value=res.val()
            if value['id'] == id:
                userkey=res.key()

        if self.pw_duplicate_check(str(userkey),str(cpw)):
            self.db.child("user").child(userkey).update({'email':(data['email']+'@'+data['email_domain']),'pw':cpw,'tel':data['tel']}) 
            print(data)
            return True
        else:
            return False
        
    def pw_duplicate_check(self, userkey, cpw_string):
        user_infor = self.db.child("user").child(userkey).get()
        value = user_infor.val()
        print("user_infor###",value)
        if value['pw'] == cpw_string:
            print("pw==cpw_string")
            return False
        print("pw!=cpw_string")
        return True
    
    def get_like_items_byuser(self, user_id):
        hearts = self.db.child("heart").child(user_id).get()
        if not hearts or not hearts.each():
            return {}
        user_likes_dict={}
        for res in hearts.each():
            value = res.val()
            item_key=res.key()
            if value["interested"] == "Y":
                item_data=self.db.child("item").child(item_key).get().val()
                user_likes_dict[item_key]=item_data
                user_likes_dict[item_key]["time"]=self.db.child("heart").child(user_id).child(item_key).child("time").get().val()
        user_likes_dict=dict(sorted(user_likes_dict.items(), key=lambda item: item[1]['time'], reverse=False))
        return user_likes_dict
    
    def get_item_byuser(self, user_id):
        items = self.db.child("item").get()
        user_sells_dict={}
        for res in items.each():
            value=res.val()
            if value["seller_id"] == user_id:
                user_sells_dict[value["item"]]=value
        return user_sells_dict
    
    def get_review_byuser(self, user_id):
        reviews=self.db.child("review").get()
        user_review_dict={}
        for res in reviews.each():
            value=res.val()
            if value["reviewer_id"] == user_id:
                user_review_dict[value["title"]]=value
        return user_review_dict
    
    def find_id_by_email_tel(self, email, tel):
        users = self.db.child("user").get()

        if not users.val():
            return None

        for res in users.each():
            value = res.val()
            if value['email'] == email and value['tel'] == tel:
                hidden_id = value['id'][:3] + '*' * (len(value['id']) - 3)
                return hidden_id
        return None

    def search_item_by_name(self, query):
        items = self.db.child("item").get()
        matching_items = {}
        for res in items.each():
            item_name = res.key()
            if query.lower() in item_name.lower():
                matching_items[item_name] = res.val()
        return matching_items
