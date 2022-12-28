from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.views import Token
from api.models import ISUser, ProductImages, Category
from django.contrib.auth.models import User


class ISUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ISUser
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'company_name', 'is_admin', 'owner')
        extra_kwargs = {
            'owner': {'read_only': True},
            'password': {'write_only': True}
        }

    def create(self, validated_data, *args, **kwargs):
        if validated_data.get("is_admin"):
            validated_data["owner"] = validated_data.get("username")
        else:
            validated_data["owner"] = self.context["request"].user.username
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        Token.objects.create(user=user)
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id","category_name", "category_description" )

    def create(self, validated_data):
        owner = ISUser.objects.get(username=self.context["request"].user.owner)
        category = super().create(validated_data)
        category.owner.add(owner)
        return category


class ProductImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ('product_id', 'image_name', 'crop', 'region', 'custom_content', 'str_attr', 'upload_datetime',
                 'category', 'owner', 'image')
        extra_kwargs = {
            'owner': {'read_only': True},
            'product_id': {'read_only': True},
            'image_name': {'read_only': True}
        }


class ImageSearchSerializer(serializers.Serializer):
    image = serializers.ImageField()
    category_id = serializers.IntegerField()
    region = serializers.CharField()

    class Meta:
        fields = ('image', 'category_id', 'region')

    def create(self, validated_data):
        return None

    def update(self, instance, validated_data):
        return None
