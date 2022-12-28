from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .alibaba_service import config
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from .alibaba_service.alibaba_connector_sdk import AlibabaService
from rest_framework import generics, mixins
from api.serializers import ISUserSerializer, CategorySerializer, ProductImagesSerializer, ProductImagesSerializer, ImageSearchSerializer
from api.models import ISUser, ProductImages, Category
from api.permissions import IsAdmin, IsOwner
import uuid
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
import os


def index(request):
    return render(request, 'build/index.html')


def generate_product_id():
    return str(uuid.uuid4())


class SearchByImage(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ImageSearchSerializer

    def get_queryset(self):
        return ProductImages.objects.filter(owner__username=self.request.user.owner)

    def post(self, request, *args, **kwargs):
        serializer = ImageSearchSerializer(data=request.data)
        if serializer.is_valid():
            picture = serializer.validated_data.get("image")
            category_id = serializer.validated_data.get("category_id", 88888888)
            picture = request.FILES.get("image")
            print("Picture name: ", picture.name)
            with open(picture.name, "wb") as file:
                file.write(picture.read())
            alibaba = AlibabaService()
            region = serializer.validated_data.get("region", None)
            
            if region:
                if region == 'null':
                    region = None
            stat, resp = alibaba.search_image_by_pic(picture.name, region=region)
            try:
                os.remove(picture.name)
            except Exception as e:
                with open("log.log", "a") as file:
                    file.write("FILE REMOVE ERROR : "+str(e))
                    file.write("\n")
            if stat != 200:
                return Response(resp, status=stat)
            response_data = list()
            Images = ProductImages.objects.filter(category__id=category_id)
            for item in resp['Auctions']:
                temp = dict()
                temp["product_id"] = item["ProductId"]
                temp["score"] = item["Score"]
                try:
                    image_object = Images.get(product_id=temp["product_id"]).image
                    temp["link"] = request.build_absolute_uri(image_object.url)
                    response_data.append(temp)
                except Exception as e:
                    print(e)
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ImageCreate(generics.GenericAPIView, mixins.ListModelMixin):
    serializer_class = ProductImagesSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductImages.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = ProductImagesSerializer(data=request.data)
        product_id = generate_product_id()
        if serializer.is_valid():
            category = Category.objects.get(id=request.data.get("category"))
            owner = ISUser.objects.get(username=self.request.user.owner)
            image_name = self.request.data.get("image").name
            alibaba = AlibabaService()
            return_value = serializer.save(owner=owner, product_id=product_id, image_name=image_name)
            stat, resp = alibaba.add_image(
                product_id, product_id, "static/"+return_value.image.name,
                serializer.validated_data.get("custom_content"),
                owner.id, str_attr=serializer.validated_data.get("str_attr"),
                crop=serializer.validated_data.get("crop", True),
                region=serializer.validated_data.get("region"))
            if stat != 200:
                return_value.delete()
                return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=stat)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class ImageUpdateRetrieveDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductImages.objects.all()
    serializer_class = ProductImagesSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    # permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return ProductImages.objects.filter(owner__username=self.request.user.owner).order_by('upload_datetime')
    

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


    def delete(self, request, *args, **kwargs):
        alibaba = AlibabaService()
        product_id = kwargs["pk"]
        image_object = ProductImages.objects.filter(owner__username=self.request.user.owner).get(product_id=product_id)
        stat, resp = alibaba.delete_image(image_object.product_id, image_object.product_id)
        return self.destroy(request, *args, **kwargs)




class UserListCreateDestroy(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = ISUserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ISUser.objects.filter(owner= self.request.user.owner)

   
class UserUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset = ISUser.objects.all()
    serializer_class = ISUserSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.set_password(instance.password)
        instance.save()


class UserSignUp(generics.CreateAPIView):
    queryset = ISUser.objects.all()
    serializer_class = ISUserSerializer


class CategoryListCreate(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner__username= self.request.user.owner)

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(owner__username= self.request.user.owner)
    
    def delete(self, request, *args, **kwargs):
        alibaba = AlibabaService()
        category_id = kwargs["pk"]
        category_object = Category.objects.filter(owner__username= self.request.user.owner).get(id=category_id)
        image_objects = ProductImages.objects.filter(owner__username= self.request.user.owner).filter(category = category_id)
        for image in image_objects:
            stat, resp = alibaba.delete_image(image.product_id, image.image_name)
        return self.destroy(request, *args, **kwargs)


def forgot_password(request, *args, **kwargs):
    email = request.POST.get('email')
    verify = ISUser.objects.filter(email=email).first()
    if verify:
        link = f"http://localhost:8000/change_password/{verify.id}"
        send_mail(
            'アカウントの確認',
            'アカウントの確認をしてくださいt',
            'aiinfinityimagesimilarity@gmail.com',
            [email],
            fail_silently=False,
            html_message=f'<p>クリックするとパスワードが変更されます。</p><p>{link}</p>'
        )
        return JsonResponse({'bool':True,'msg':'パスワードの変更をメールで確認する!'})
    else:
        return JsonResponse({'bool':False,'msg':'無効なメール!'})

def change_password(request, pk):
    password = request.POST.get('password')
    print(password)
    print(pk)
    verify = ISUser.objects.filter(id=pk).first()
    print(verify)
    if verify:
        # ISUser.objects.filter(id=pk).update(password=password)
        u = ISUser.objects.get(id=pk)
        u.set_password(password)
        u.save()
        return JsonResponse({'bool':True,'msg':'パスワードの変更に成功しました!'})
    else:
        return JsonResponse({'bool':False,'msg':'エラーが発生しました。もう一度やり直してください!'})







   