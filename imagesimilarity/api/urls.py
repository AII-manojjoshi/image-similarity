from xml.etree.ElementInclude import include
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt

# router = DefaultRouter()
# router.register('test', views.TestViewSet)

urlpatterns = [
    path("add", views.ImageCreate.as_view()),
    path("image/<str:pk>", views.ImageUpdateRetrieveDelete.as_view()),
    path("search", views.SearchByImage.as_view()),
    path("user", views.UserListCreateDestroy.as_view()),
    path("update/<int:pk>", views.UserUpdate.as_view()),
    path("signup", views.UserSignUp.as_view()),
    path("category", views.CategoryListCreate.as_view()),
    path("categorydetail/<pk>", views.CategoryDetail.as_view()),
    path("forgotpassword", csrf_exempt(views.forgot_password)),
    path("changepassword/<int:pk>", csrf_exempt(views.change_password)),
   
]