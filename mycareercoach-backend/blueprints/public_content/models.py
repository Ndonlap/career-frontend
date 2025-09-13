from extensions import mongo
from bson.objectid import ObjectId
from datetime import datetime

class PublicContent:
    collection_name = 'public_content'

    def __init__(self, type, title, description, **kwargs):
        self.type = type # "service_item", "resource_article", "faq_item", "homepage_hero"
        self.title = title
        self.description = description
        self.content = kwargs.get('content', '') # For full article bodies, FAQ answers
        self.icon_name = kwargs.get('icon_name', None) # For services
        self.icon_color = kwargs.get('icon_color', None) # For services
        self.image_url = kwargs.get('image_url', None) # For resources, homepage hero background
        self.link_url = kwargs.get('link_url', None) # External links, or internal routing
        self.is_featured = kwargs.get('is_featured', False) # For resources
        self.order = kwargs.get('order', 0) # For display order
        self.status = kwargs.get('status', 'draft') # published, draft
        self.published_at = kwargs.get('published_at', datetime.utcnow() if self.status == 'published' else None)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def find_all_published_by_type(cls, content_type):
        items_data = mongo.db[cls.collection_name].find({"type": content_type, "status": "published"}).sort("order", 1)
        return [cls(**item) for item in items_data]

    @classmethod
    def find_one_by_type(cls, content_type):
        item_data = mongo.db[cls.collection_name].find_one({"type": content_type, "status": "published"})
        if item_data:
            return cls(**item_data)
        return None

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        if doc['published_at']:
            doc['published_at'] = doc['published_at'].isoformat()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc

# For global settings, a single document in a dedicated collection is often simpler.
class SystemSettings:
    collection_name = 'system_settings' # This will typically only have one document

    def __init__(self, platform_name, **kwargs):
        self.platform_name = platform_name
        self.max_users_per_session = kwargs.get('max_users_per_session', 50000)
        self.session_timeout_minutes = kwargs.get('session_timeout_minutes', 30)
        self.two_factor_auth_enabled = kwargs.get('two_factor_auth_enabled', False)
        self.password_complexity_level = kwargs.get('password_complexity_level', 'High')
        self.data_encryption_standard = kwargs.get('data_encryption_standard', 'AES-256')
        self.analytics_tracking_enabled = kwargs.get('analytics_tracking_enabled', True)
        self.email_notifications_enabled = kwargs.get('email_notifications_enabled', True)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = "global_settings" # Fixed ID for single document

    def save(self):
        doc = {k: v for k, v in self.__dict__.items()}
        # Use upsert to create if not exists, or update if it does
        result = mongo.db[self.collection_name].update_one(
            {"_id": self._id}, {"$set": doc}, upsert=True
        )
        return self._id

    @classmethod
    def get_settings(cls):
        settings_data = mongo.db[cls.collection_name].find_one({"_id": "global_settings"})
        if settings_data:
            return cls(**settings_data)
        return None # Or return default instance: cls(platform_name="MyCareerCoach")

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items()}
        doc['id'] = doc.pop('_id')
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc