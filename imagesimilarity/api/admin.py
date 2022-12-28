from django.contrib import admin
from .models import Category, ISUser, ProductImages

# Register your models here.
admin.site.register(Category)
admin.site.register(ISUser)
admin.site.register(ProductImages)
# admin.site.register(TestImage)
