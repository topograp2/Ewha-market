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
    
    def reg_review(self, data, img_path):
        review_info={
            "title": data['title'],
            "rate": data['reviewStar'],
            "review": data['reviewContents'],
            "img_path": img_path
        }
        self.db.child("review").child(data['name']).set(review_info)
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
