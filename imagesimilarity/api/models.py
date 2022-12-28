from django.db import models
from django.contrib.auth.models import User, AbstractUser
import uuid

class ISUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    company_name = models.CharField(max_length=128)
    owner = models.CharField(max_length=120)
    username = models.CharField(max_length=128, blank=False, unique=True)


class Category(models.Model):
    category_name = models.CharField(max_length=100)
    owner = models.ManyToManyField(ISUser, related_name="owner_category")
    category_description = models.TextField(blank = True)

    def __str__(self):
        return self.category_name


class ProductImages(models.Model):
    product_id = models.CharField(primary_key=True, max_length=512, blank=True)
    image_name = models.CharField(max_length=512, blank=True)
    image = models.ImageField(upload_to="static/images/")
    crop = models.BooleanField(default=True)
    region = models.CharField(blank=True, max_length=30, default=None, null=True)
    custom_content = models.CharField(blank=True, max_length=30, default="")
    str_attr = models.CharField(blank=True, max_length=128, default="")
    upload_datetime = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, related_name='image_category', on_delete=models.CASCADE)
    owner = models.ForeignKey(ISUser, related_name='image_owner', on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):
        print("Image name: ", type(self.image_name))
        new_name = str(uuid.uuid4())+"."+self.image_name.split(".")[-1]
        self.image.name = new_name
        print("Set name: ", self.image.name)
        print("Owner: ", self.owner)
        print("Region: ", self.owner)
        super(ProductImages, self).save(*args, **kwargs)

    def __str__(self):
        return self.image_name




